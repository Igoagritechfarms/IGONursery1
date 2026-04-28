// Run this in the browser console to simulate a customer reply for testing notifications
export const simulateCustomerReply = (leadId: string, message: string) => {
  const leads = JSON.parse(localStorage.getItem('igo_leads') || '[]');
  const updatedLeads = leads.map((l: any) => {
    if (l.id === leadId) {
      return {
        ...l,
        status: 'new',
        chatHistory: [...(l.chatHistory || []), { 
          sender: 'customer', 
          message, 
          timestamp: new Date().toISOString() 
        }]
      };
    }
    return l;
  });
  localStorage.setItem('igo_leads', JSON.stringify(updatedLeads));
  window.dispatchEvent(new StorageEvent('storage', { key: 'igo_leads' }));
};
