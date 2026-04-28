import React, { useState, useMemo } from 'react';
import { 
  User, 
  Package, 
  Settings, 
  CreditCard, 
  Bell, 
  ChevronRight, 
  LogOut, 
  Truck, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Shield,
  XOctagon
} from 'lucide-react';
import { Customer, Order, Notification, Lead } from '../types';
import { customerApi } from '../services/customerApi';
import { MessageSquare, Send, Inbox, ArrowLeft, Copy, ExternalLink, Wallet } from 'lucide-react';

type TabType = 'account' | 'orders' | 'billing' | 'settings' | 'inbox' | 'privacy' | 'tracker';

interface CustomerProfileProps {
  customer: Customer;
  orders: Order[];
  notifications: Notification[];
  onLogout: () => void;
  onUpdateProfile: (customer: Customer) => void;
  onRefreshNotifications?: () => void;
  initialTab?: TabType;
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({
  customer,
  orders,
  notifications,
  onLogout,
  onUpdateProfile,
  onRefreshNotifications,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab || 'account');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: customer?.name || '', phone: customer?.phone || '' });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [delRequestSent, setDelRequestSent] = useState(false);
  const [customerLeads, setCustomerLeads] = useState<Lead[]>([]);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isNoteVisible, setIsNoteVisible] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const selectedOrder = useMemo(() => 
    orders.find(o => o.orderNumber === selectedOrderId),
    [orders, selectedOrderId]
  );

  const loadLeads = () => {
    const allLeads = JSON.parse(localStorage.getItem('igo_leads') || '[]');
    const myLeads = allLeads.filter((l: Lead) => l.customerEmail === customer.email);
    setCustomerLeads(myLeads);
  };

  React.useEffect(() => {
    loadLeads();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'igo_leads') loadLeads();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [customer.email]);

  // Sync with URL changes
  React.useEffect(() => {
    // 1. Detect query params for deep-linking (e.g., inbox?id=lead-123)
    if (initialTab && (initialTab.includes('inbox?id=') || initialTab.includes('inbox%3Fid%3D'))) {
      const decoded = decodeURIComponent(initialTab);
      const parts = decoded.split('?id=');
      setActiveTab('inbox');
      if (parts[1]) {
        // Slight delay to ensure loadLeads has processed
        setTimeout(() => setActiveLeadId(parts[1]), 100);
      }
    } else if (initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const currentOrders = useMemo(() => 
    orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)), 
    [orders]
  );
  
  const pastOrders = useMemo(() => 
    orders.filter(o => ['delivered', 'cancelled'].includes(o.status)), 
    [orders]
  );

  const handleUpdateProfile = async () => {
    try {
      const res = await customerApi.updateProfile(formData);
      onUpdateProfile(res.customer);
      setIsEditing(false);
    } catch (e) {
      alert('Failed to update profile');
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !activeLeadId) return;
    
    try {
      await customerApi.addMessageToLead(activeLeadId, 'customer', replyText);
      setReplyText('');
      loadLeads();
      alert("Official reply transmitted to IGO Administration.");
      // Optional: Visual confirmation for the user
      const chat = document.getElementById('chat-container');
      if (chat) chat.scrollTo({ top: chat.scrollHeight, behavior: 'smooth' });
    } catch (e) {
      console.error('Reply submission failed:', e);
      alert("Transmission failed. Please check your connection.");
    }
  };

  const markRead = async (id: number) => {
    try {
      await customerApi.markNotificationRead(id);
      if (onRefreshNotifications) {
        onRefreshNotifications();
      }
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    if (unread.length === 0) return;
    
    try {
      await Promise.all(unread.map(n => customerApi.markNotificationRead(n.id)));
      if (onRefreshNotifications) {
        onRefreshNotifications();
      }
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  const handleRequestDeletion = async (reason: string) => {
    try {
      await customerApi.requestDeletion(customer, reason);
      setDelRequestSent(true);
      loadLeads();
    } catch (e) {
      alert('Failed to send deletion request. Please contact support.');
    }
  };


  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'shipped': return <Truck className="w-5 h-5 text-igo-lime" />;
      case 'delivered': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'processing': return <Clock className="w-5 h-5 text-blue-500" />;
      default: return <AlertCircle className="w-5 h-5 text-igo-muted" />;
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed py-12 px-4 relative overflow-hidden" style={{ backgroundImage: "url('/images/branding/profile-bg.png')" }}>
      {/* Premium Overlay for readability */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Nav */}
        <div className="lg:w-96 flex-shrink-0 w-full">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/40 sticky top-28 w-full">
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-50">
              <div className="w-14 h-14 bg-igo-lime rounded-2xl flex items-center justify-center font-black text-xl text-igo-dark shadow-sm">
                {customer.name.charAt(0)}
              </div>
              <div className="flex flex-col min-w-0 max-w-full overflow-visible">
                <h3 className="font-black text-igo-dark uppercase tracking-tight text-sm break-words leading-tight whitespace-normal">{customer?.name || 'Customer'}</h3>
                <p className="text-[10px] font-bold text-igo-muted break-all opacity-80 leading-relaxed mt-1 whitespace-normal">{customer?.email || 'No email'}</p>
              </div>
            </div>

            <nav className="space-y-2">
              {[
                { id: 'account', label: 'Account Details', icon: User },
                { id: 'orders', label: 'My Orders', icon: Package },
                { id: 'tracker', label: 'Track Order', icon: Truck },
                { id: 'billing', label: 'Billing Info', icon: CreditCard },
                { id: 'inbox', label: 'Inbox', icon: Bell },
                { id: 'settings', label: 'Settings', icon: Settings },
                { id: 'privacy', label: 'Privacy', icon: Shield },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${
                      activeTab === tab.id 
                        ? 'bg-igo-dark text-white shadow-2xl scale-[1.02]' 
                        : 'text-igo-dark hover:bg-igo-lime/10'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-igo-lime' : 'text-igo-muted'}`} />
                    <span className="uppercase tracking-widest text-[10px]">{tab.label}</span>
                  </div>
                  {tab.badge ? (
                    <span className="bg-igo-lime text-igo-dark text-[10px] px-2 py-0.5 rounded-full font-black">
                      {tab.badge}
                    </span>
                  ) : (
                    <ChevronRight className={`w-4 h-4 opacity-30 ${activeTab === tab.id ? 'hidden' : ''}`} />
                  )}
                </button>
              ))}
              
              <div className="pt-4 mt-4 border-t border-gray-50">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-red-600 hover:bg-red-50 transition-all text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="uppercase tracking-widest text-[10px]">Logout Account</span>
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow w-full lg:w-2/3">
          <div className="bg-white/90 backdrop-blur-2xl rounded-[3rem] p-8 lg:p-14 shadow-[0_32px_100px_-20px_rgba(0,0,0,0.15)] border border-white/50 min-h-[700px] animate-in fade-in slide-in-from-right-12 duration-700">
            
            {activeTab === 'account' && (
              <div className="space-y-8">
                <div className="mb-10">
                  <h2 className="text-5xl font-black text-igo-dark uppercase tracking-tighter mb-3 leading-none">Account Details</h2>
                  <div className="h-1.5 w-24 bg-igo-lime rounded-full mb-4" />
                  <p className="text-igo-muted font-bold uppercase tracking-[0.2em] text-[10px]">Manage your high-security biometric and contact profile</p>
                </div>

                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-igo-muted uppercase tracking-widest ml-4">Full Name</label>
                    <input
                      disabled={!isEditing}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold text-igo-dark outline-none focus:border-igo-lime focus:bg-white transition-all disabled:opacity-60"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-igo-muted uppercase tracking-widest ml-4">Email Address</label>
                    <input
                      disabled
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold text-igo-dark opacity-60"
                      value={customer.email}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-igo-muted uppercase tracking-widest ml-4">Phone Number</label>
                    <input
                      disabled={!isEditing}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold text-igo-dark outline-none focus:border-igo-lime focus:bg-white transition-all disabled:opacity-60"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-8">
                  {isEditing ? (
                    <div className="flex gap-4">
                      <button 
                        onClick={handleUpdateProfile}
                        className="bg-igo-lime text-igo-dark px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-igo-lime/90 transition-all"
                      >
                        Save Changes
                      </button>
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-100 text-igo-dark px-8 py-4 rounded-2xl font-black uppercase tracking-widest"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="bg-igo-dark text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-igo-charcoal transition-all"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-12">
                {!selectedOrder ? (
                  <>
                    <div>
                      <h2 className="text-4xl font-black text-igo-dark uppercase tracking-tighter mb-2">My Greenery Projects</h2>
                      <p className="text-igo-muted font-bold uppercase tracking-widest text-xs">Track active and past orders</p>
                    </div>

                    <div className="space-y-8">
                      <section>
                        <h3 className="text-[10px] font-black text-igo-lime uppercase tracking-[0.3em] mb-6 border-b border-igo-lime/20 pb-2">Active Projects</h3>
                        {currentOrders.length > 0 ? (
                          <div className="grid gap-4">
                            {currentOrders.map(order => (
                              <button 
                                key={order.orderNumber} 
                                onClick={() => setSelectedOrderId(order.orderNumber)}
                                className="w-full flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-igo-lime transition-all group text-left"
                              >
                                <div className="flex items-center gap-6">
                                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                    {renderStatusIcon(order.status)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-black text-igo-dark uppercase tracking-tight">#{order.orderNumber}</p>
                                    <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1">
                                      {order.items.slice(0, 2).map((item, idx) => (
                                        <span key={idx} className="text-[9px] font-black text-igo-lime bg-igo-lime/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                          {item.product.name}
                                        </span>
                                      ))}
                                      {order.items.length > 2 && (
                                        <span className="text-[9px] font-black text-igo-muted bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                          +{order.items.length - 2} more
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] font-bold text-igo-muted uppercase tracking-widest mt-1">Ordered {new Date(order.createdAt).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <div className="text-right flex items-center gap-6">
                                  <div>
                                    <p className="text-sm font-black text-igo-dark">₹{order.total.toLocaleString()}</p>
                                    <p className="text-[10px] font-bold text-igo-lime uppercase tracking-widest">{order.status}</p>
                                  </div>
                                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-igo-lime transition-colors" />
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 font-bold italic py-8">No active projects currently.</p>
                        )}
                      </section>

                      <section>
                        <h3 className="text-[10px] font-black text-igo-muted uppercase tracking-[0.3em] mb-6 border-b border-gray-200 pb-2">Completed History</h3>
                        {pastOrders.length > 0 ? (
                          <div className="grid gap-4 opacity-80">
                            {pastOrders.map(order => (
                              <button 
                                key={order.orderNumber} 
                                onClick={() => setSelectedOrderId(order.orderNumber)}
                                className="w-full flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-100 grayscale hover:grayscale-0 transition-all text-left group"
                              >
                                <div className="flex items-center gap-6">
                                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                                    {renderStatusIcon(order.status)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-black text-igo-dark uppercase tracking-tight">#{order.orderNumber}</p>
                                    <p className="text-[10px] font-bold text-igo-muted uppercase tracking-widest mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <div className="text-right flex items-center gap-6">
                                  <div>
                                    <p className="text-sm font-black text-igo-dark">₹{order.total.toLocaleString()}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest">{order.status}</p>
                                  </div>
                                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-igo-muted transition-colors" />
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 font-bold italic py-8">No past orders found.</p>
                        )}
                      </section>
                    </div>
                  </>
                ) : (
                  <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-500">
                    {/* Header with Back Button */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-50">
                       <div className="flex items-center gap-4">
                         <button 
                           onClick={() => setSelectedOrderId(null)}
                           className="p-3 bg-gray-50 text-igo-dark rounded-2xl hover:bg-igo-lime hover:text-igo-dark transition-all"
                         >
                            <ArrowLeft className="w-5 h-5" />
                         </button>
                         <div>
                            <div className="flex items-center gap-3">
                              <h2 className="text-3xl font-black text-igo-dark uppercase tracking-tighter">Order Detail</h2>
                              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                                selectedOrder.status === 'shipped' ? 'bg-igo-lime/20 text-igo-dark' : 'bg-blue-50 text-blue-600'
                              }`}>
                                {selectedOrder.status}
                              </span>
                            </div>
                            <p className="text-[10px] font-bold text-igo-muted uppercase tracking-[0.2em] mt-1">Ref: {selectedOrder.orderNumber} • Placed {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                         </div>
                       </div>
                       <button 
                         onClick={() => {
                           setActiveTab('inbox');
                           // Could add logic to open a specific lead if it exists
                         }}
                         className="flex items-center justify-center gap-2 px-6 py-4 bg-igo-dark text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all"
                       >
                          <MessageSquare className="w-4 h-4 text-igo-lime" />
                          Need Help with this order?
                       </button>
                    </div>

                    {/* Timeline Tracker */}
                    <div className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100">
                       <h3 className="text-[10px] font-black text-igo-dark uppercase tracking-widest mb-10 text-center">Project Timeline</h3>
                       <div className="relative flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
                          {/* Progress Line */}
                          <div className="hidden md:block absolute top-5 left-1/2 -translate-x-1/2 w-[85%] h-1 bg-gray-200 z-0">
                             <div 
                               className="h-full bg-igo-lime transition-all duration-1000" 
                               style={{ width: selectedOrder.status === 'delivered' ? '100%' : selectedOrder.status === 'shipped' ? '66%' : '33%' }} 
                             />
                          </div>

                          {[
                            { label: 'Confirmed', icon: CheckCircle2, status: 'pending', date: selectedOrder.createdAt },
                            { label: 'Processing', icon: Clock, status: 'processing', date: selectedOrder.createdAt },
                            { label: 'Shipped', icon: Truck, status: 'shipped', date: selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? 'Estimated' : null },
                            { label: 'Delivered', icon: Package, status: 'delivered', date: selectedOrder.status === 'delivered' ? selectedOrder.estimatedDelivery : null }
                          ].map((step, idx) => {
                            const isDone = ['pending', 'processing', 'shipped', 'delivered'].indexOf(selectedOrder.status) >= ['pending', 'processing', 'shipped', 'delivered'].indexOf(step.status);
                            const isActive = selectedOrder.status === step.status;
                            return (
                              <div key={idx} className="relative z-10 flex flex-col items-center gap-4 group">
                                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${
                                   isDone ? 'bg-igo-lime text-igo-dark scale-110' : 'bg-white text-gray-300 border-2 border-gray-100'
                                 } ${isActive ? 'ring-4 ring-igo-lime/30 animate-pulse' : ''}`}>
                                    <step.icon className="w-5 h-5" />
                                 </div>
                                 <div className="text-center">
                                    <p className={`text-[10px] font-black uppercase tracking-tight ${isDone ? 'text-igo-dark' : 'text-gray-400'}`}>{step.label}</p>
                                    {isDone && step.date && (
                                      <p className="text-[8px] font-bold text-igo-muted uppercase mt-1">
                                        {idx < 2 ? new Date(step.date).toLocaleDateString() : 'Active'}
                                      </p>
                                    )}
                                 </div>
                              </div>
                            );
                          })}
                       </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                       {/* Left Column: Items */}
                       <div className="space-y-6">
                          <h4 className="text-[10px] font-black text-igo-muted uppercase tracking-widest ml-4">Items Breakdown</h4>
                          <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden">
                             {selectedOrder.items.map((item, idx) => (
                               <div key={idx} className="flex items-center justify-between p-6 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                  <div className="flex items-center gap-4">
                                     <div className="w-14 h-14 bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center group">
                                        {item.product.image ? (
                                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                        ) : (
                                          <Package className="w-6 h-6 text-gray-300" />
                                        )}
                                     </div>
                                     <div>
                                        <p className="text-xs font-black text-igo-dark uppercase">{item.product.name}</p>
                                        <p className="text-[10px] font-bold text-igo-muted uppercase mt-0.5">₹{item.product.price.toLocaleString()} × {item.quantity}</p>
                                     </div>
                                  </div>
                                  <p className="text-xs font-black text-igo-dark">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                               </div>
                             ))}
                             
                             <div className="bg-gray-50 p-8 space-y-3">
                                <div className="flex justify-between text-[10px] font-bold text-igo-muted uppercase tracking-widest">
                                   <span>Subtotal</span>
                                   <span>₹{selectedOrder.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-igo-muted uppercase tracking-widest">
                                   <span>IGST (18%)</span>
                                   <span>₹{selectedOrder.tax.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-igo-muted uppercase tracking-widest">
                                   <span>Delivery Charge</span>
                                   <span>{selectedOrder.deliveryCharge === 0 ? 'FREE' : `₹${selectedOrder.deliveryCharge.toLocaleString()}`}</span>
                                </div>
                                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                   <span className="text-xs font-black text-igo-dark uppercase tracking-widest">Grand Total</span>
                                   <span className="text-2xl font-black text-igo-dark tracking-tighter">₹{selectedOrder.total.toLocaleString()}</span>
                                </div>
                             </div>
                          </div>
                       </div>

                       {/* Right Column: Logistics & Payment */}
                       <div className="space-y-8">
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-igo-muted uppercase tracking-widest ml-4">Shipping Destination</h4>
                            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 space-y-4">
                               <div className="flex items-start gap-4">
                                  <div className="p-3 bg-igo-lime/10 rounded-xl">
                                     <Truck className="w-5 h-5 text-igo-lime" />
                                  </div>
                                  <div>
                                     <p className="text-xs font-black text-igo-dark uppercase">{selectedOrder.customerName}</p>
                                     <p className="text-[10px] font-bold text-igo-muted leading-relaxed mt-2 uppercase">
                                       {selectedOrder.shippingAddress}<br />
                                       {selectedOrder.city}, {selectedOrder.state}<br />
                                       {selectedOrder.zipCode}
                                     </p>
                                     <p className="text-[10px] font-bold text-igo-dark mt-3">{selectedOrder.customerPhone}</p>
                                  </div>
                               </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-igo-muted uppercase tracking-widest ml-4">Logistics & Tracking</h4>
                            <div className="bg-igo-dark text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                               <div className="absolute top-0 right-0 p-4">
                                  <button 
                                    onClick={() => {
                                      navigator.clipboard.writeText(selectedOrder.trackingNumber);
                                      alert('Tracking number copied!');
                                    }}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                                  >
                                     <Copy className="w-4 h-4 text-igo-lime" />
                                  </button>
                               </div>
                               <div className="space-y-2">
                                  <p className="text-[8px] font-black text-igo-lime uppercase tracking-[0.3em]">Carrier Tracking Ref</p>
                                  <p className="text-xl font-mono font-black tracking-widest">{selectedOrder.trackingNumber}</p>
                                  <div className="pt-4">
                                     <button className="flex items-center gap-2 text-[10px] font-black text-white bg-white/10 px-4 py-2 rounded-xl hover:bg-igo-lime hover:text-igo-dark transition-all">
                                        Track Carrier <ExternalLink className="w-3 h-3" />
                                     </button>
                                  </div>
                               </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-igo-muted uppercase tracking-widest ml-4">Payment Summary</h4>
                            <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                  <div className="p-3 bg-white rounded-xl shadow-sm">
                                     <Wallet className="w-5 h-5 text-igo-dark" />
                                  </div>
                                  <div>
                                     <p className="text-[10px] font-black text-igo-dark uppercase tracking-tight">{selectedOrder.paymentMethod}</p>
                                     <p className="text-[8px] font-bold text-igo-muted uppercase mt-0.5">Card ending in **** {selectedOrder.lastFour || 'XXXX'}</p>
                                  </div>
                               </div>
                               <CheckCircle2 className="w-6 h-6 text-green-500" />
                            </div>
                          </div>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-black text-igo-dark uppercase tracking-tighter mb-2">Billing Information</h2>
                  <p className="text-igo-muted font-bold uppercase tracking-widest text-xs">Manage payment references and addresses</p>
                </div>

                <div className="grid gap-8">
                  <div className="bg-igo-dark p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-igo-lime/20 rounded-full blur-3xl group-hover:bg-igo-lime/40 transition-all duration-700" />
                    <div className="flex justify-between items-start mb-12">
                      <CreditCard className="w-10 h-10 text-igo-lime" />
                      <div className="text-right">
                        <p className="text-[10px] font-black text-igo-lime uppercase tracking-[0.2em]">Priority Member</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-black tracking-[0.3em]">**** **** **** {orders.find(o => o.lastFour)?.lastFour || 'XXXX'}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest uppercase">Last used card reference</p>
                    </div>
                  </div>

                  <div className="border border-gray-100 rounded-3xl p-6 bg-gray-50">
                    <h4 className="text-[10px] font-black text-igo-dark uppercase tracking-widest mb-4">Saved Shipping Address</h4>
                    {orders.length > 0 ? (
                      <div className="text-sm text-igo-dark font-bold space-y-1">
                        <p>{orders[0].shippingAddress}</p>
                        <p>{orders[0].city}, {orders[0].state} - {orders[0].zipCode}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No address saved yet. Place your first order to save an address.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'inbox' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-black text-igo-dark uppercase tracking-tighter mb-2">Project Updates</h2>
                  <div className="flex justify-between items-center">
                    <p className="text-igo-muted font-bold uppercase tracking-widest text-xs">Recent notifications and messages</p>
                    <div className="flex gap-4">
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllRead}
                          className="text-[10px] font-black text-igo-lime uppercase tracking-widest hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 min-h-[500px]">
                  {/* Left List of Threads */}
                  <div className="w-full lg:w-1/3 border-r border-gray-50 pr-4 space-y-4">
                    {/* Support threads / Messages */}
                    {customerLeads.length > 0 ? (
                      customerLeads.map(lead => (
                        <div 
                          key={lead.id}
                          onClick={() => setActiveLeadId(lead.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            activeLeadId === lead.id ? 'bg-igo-dark text-white border-igo-dark' : 'bg-gray-50 border-gray-100 hover:bg-igo-lime/5'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <MessageSquare className={`w-4 h-4 ${activeLeadId === lead.id ? 'text-igo-lime' : 'text-igo-muted'}`} />
                            <div className="overflow-hidden">
                              <p className="text-[10px] font-black uppercase tracking-tight truncate">
                                {lead.type.replace('-', ' ')}
                              </p>
                              <p className={`text-[8px] font-bold uppercase ${activeLeadId === lead.id ? 'text-igo-lime' : 'text-igo-muted'}`}>
                                Status: {lead.status}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-[10px] font-black text-igo-muted uppercase tracking-widest">No active threads</p>
                      </div>
                    )}
                  </div>

                  {/* Right Chat Experience */}
                  <div className="flex-grow flex flex-col bg-gray-50/50 rounded-3xl overflow-hidden border border-gray-100">
                    {activeLeadId ? (
                      <>
                        <div className="p-6 border-b border-gray-100 bg-white flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-black text-igo-muted uppercase tracking-widest leading-none mb-1">
                              {customerLeads.find(l => l.id === activeLeadId)?.type.replace('-', ' ')}
                            </p>
                            <h4 className="text-lg font-black text-igo-dark uppercase tracking-tighter">Support Thread</h4>
                          </div>
                        </div>

                        <div className="flex-grow p-6 overflow-y-auto space-y-4 max-h-[400px]">
                          {(customerLeads.find(l => l.id === activeLeadId)?.chatHistory || []).map((chat, i) => (
                            <div key={i} className={`flex ${chat.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[85%] p-4 rounded-2xl ${
                                chat.sender === 'customer' ? 'bg-igo-dark text-white rounded-tr-none' : 'bg-white border border-gray-100 text-igo-dark rounded-tl-none'
                              }`}>
                                <p className="text-xs font-bold leading-relaxed">{chat.message}</p>
                                <p className="text-[8px] mt-2 opacity-40 uppercase font-black">{new Date(chat.timestamp).toLocaleTimeString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="p-6 bg-white border-t border-gray-100">
                          <div className="flex gap-2">
                             <input 
                               placeholder="Reply to our team official..."
                               value={replyText}
                               onChange={(e) => setReplyText(e.target.value)}
                               onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                               className="flex-grow bg-gray-50 px-4 py-3 rounded-xl text-xs font-bold border-transparent focus:border-igo-lime transition-all outline-none"
                             />
                             <button 
                               onClick={handleSendReply}
                               className="p-3 bg-igo-dark text-white rounded-xl hover:bg-igo-lime hover:text-igo-dark transition-all flex items-center justify-center disabled:opacity-50"
                               disabled={!replyText.trim()}
                             >
                                <Send className="w-4 h-4" />
                             </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex-grow flex flex-col items-center justify-center p-12 text-center">
                        <Inbox className="w-16 h-16 text-gray-100 mb-4" />
                        <h4 className="text-xl font-black text-igo-dark uppercase tracking-tighter">Select a Support Thread</h4>
                        <p className="text-[10px] font-black text-igo-muted uppercase tracking-widest mt-2">Active requests and project updates will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-black text-igo-dark uppercase tracking-tighter mb-2">Settings</h2>
                  <p className="text-igo-muted font-bold uppercase tracking-widest text-xs">Privacy and preferences</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 transition-all">
                    <div>
                      <p className="text-sm font-black text-igo-dark uppercase tracking-tight">Email Notifications</p>
                      <p className="text-[10px] font-bold text-igo-muted uppercase tracking-widest">Receive updates about order status</p>
                    </div>
                    <button 
                      onClick={async (e) => {
                        const btn = e.currentTarget;
                        btn.disabled = true;
                        try {
                          const res = await customerApi.updateSettings({
                            name: customer.name,
                            phone: customer.phone || '',
                            emailNotifications: !customer.emailNotifications
                          });
                          onUpdateProfile(res.customer);
                        } catch (err) {
                          console.error('Settings error:', err);
                          alert('Failed to update settings. Please try again.');
                        } finally {
                          if (btn) btn.disabled = false;
                        }
                      }}
                      className={`w-12 h-6 rounded-full relative transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-wait ${
                        customer.emailNotifications ? 'bg-igo-lime shadow-igo-lime/20 shadow-lg' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 pointer-events-none ${
                        customer.emailNotifications ? 'right-1' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <div>
                      <p className="text-sm font-black text-igo-dark uppercase tracking-tight">Security</p>
                      <p className="text-[10px] font-bold text-igo-muted uppercase tracking-widest">Change your account password</p>
                    </div>
                    <button 
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="text-xs font-black text-igo-lime uppercase tracking-widest border-b-2 border-igo-lime pb-0.5"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'privacy' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-black text-igo-dark uppercase tracking-tighter mb-2">Privacy & GDPR</h2>
                  <p className="text-igo-muted font-bold uppercase tracking-widest text-xs">Your data rights and security</p>
                </div>

                <div className="grid gap-6">
                  <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                    <h3 className="text-sm font-black text-igo-dark uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Shield className="w-4 h-4 text-igo-lime" />
                       Data Transparency
                    </h3>
                    <p className="text-sm text-igo-muted leading-relaxed">
                      At IGO Precision Nursery, we only store data essential for processing your orders (Name, Email, Phone, and Address). Your data is never shared with third-party marketing agencies.
                    </p>
                  </div>

                  <div className="bg-red-50 rounded-3xl p-6 border border-red-100">
                    <h3 className="text-sm font-black text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <XOctagon className="w-4 h-4 text-red-600" />
                       Account Deletion
                    </h3>
                    <p className="text-sm text-red-800 leading-relaxed mb-6 font-bold">
                      Permanent deletion will remove your profile, notifications, and active sessions. Historical orders will be unlinked for accounting compliance.
                    </p>
                    {delRequestSent ? (
                      <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-red-200 animate-in zoom-in duration-300">
                        <p className="text-red-600 font-black uppercase tracking-widest text-[10px] text-center">
                          Request Sent! Admin will process it shortly. See "Inbox" for updates.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <textarea 
                          placeholder="Please tell us why you want to delete your account..."
                          className="w-full bg-white border border-red-100 rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-red-500 transition-all min-h-[100px]"
                          id="deletionReason"
                        />
                        <button 
                          onClick={() => {
                            const reason = (document.getElementById('deletionReason') as HTMLTextAreaElement)?.value;
                            if (!reason.trim()) {
                               alert('Please provide a reason for deletion.');
                               return;
                            }
                            handleRequestDeletion(reason);
                          }}
                          className="w-full bg-red-600 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2 group"
                        >
                          Request Permanent Deletion
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    )}
                    <p className="mt-4 text-[10px] text-red-400 font-bold uppercase text-center">
                      Admin intervention is required for permanent data destruction.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'tracker' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-black text-igo-dark uppercase tracking-tighter mb-2">Order Tracker</h2>
                  <p className="text-igo-muted font-bold uppercase tracking-widest text-xs">Real-time status of your greenery</p>
                </div>

                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                   <p className="text-[10px] font-black uppercase tracking-widest text-igo-muted mb-4">Enter Order ID</p>
                   <div className="flex gap-4">
                      <input 
                        type="text" 
                        placeholder="IGO-XXXXX..." 
                        className="flex-grow px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl font-mono font-bold text-igo-dark outline-none focus:border-igo-lime transition-all"
                      />
                      <button className="bg-igo-dark text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-igo-lime hover:text-igo-dark transition-all shadow-lg">
                        Track
                      </button>
                   </div>
                </div>

                <div className="border-t border-gray-50 pt-8 mt-8">
                   <h3 className="text-sm font-black text-igo-dark uppercase tracking-widest mb-6">Quick Select</h3>
                   <div className="grid gap-4">
                      {orders.slice(0, 3).map(o => (
                        <button 
                          key={o.orderNumber}
                          onClick={() => {
                            // Logic to track this specific order
                            alert(`Tracking order ${o.orderNumber}...`);
                          }}
                          className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-igo-lime transition-all text-left"
                        >
                           <div className="flex items-center gap-4">
                              <div className="p-2 bg-gray-50 rounded-xl">
                                 <Package className="w-4 h-4 text-igo-lime" />
                              </div>
                              <div>
                                 <p className="text-[10px] font-black text-igo-dark uppercase tracking-widest">#{o.orderNumber}</p>
                                 <p className="text-[10px] text-igo-muted font-bold uppercase">{new Date(o.createdAt).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <ChevronRight className="w-4 h-4 text-gray-300" />
                        </button>
                      ))}
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-igo-dark/80 backdrop-blur-md" onClick={() => setIsPasswordModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-3xl font-black text-igo-dark uppercase tracking-tighter mb-2">Update Security</h3>
            <p className="text-igo-muted font-bold uppercase tracking-widest text-xs mb-8">Change your account password</p>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                alert('New passwords do not match');
                return;
              }
              try {
                await customerApi.changePassword({
                  currentPassword: passwordForm.currentPassword,
                  newPassword: passwordForm.newPassword
                });
                alert('Password updated successfully');
                setIsPasswordModalOpen(false);
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
              } catch (err: any) {
                alert(err.message);
              }
            }} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-igo-muted uppercase tracking-widest ml-4">Current Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold text-igo-dark outline-none focus:border-igo-lime focus:bg-white transition-all"
                  value={passwordForm.currentPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-igo-muted uppercase tracking-widest ml-4">New Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold text-igo-dark outline-none focus:border-igo-lime focus:bg-white transition-all"
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-igo-muted uppercase tracking-widest ml-4">Confirm New Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold text-igo-dark outline-none focus:border-igo-lime focus:bg-white transition-all"
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-grow bg-igo-dark text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-igo-charcoal transition-all"
                >
                  Confirm Change
                </button>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="bg-gray-100 text-igo-dark px-8 py-4 rounded-2xl font-black uppercase tracking-widest"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;
