import React from 'react';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartPageProps {
  items: CartItem[];
  onIncrease: (productId: string) => void;
  onDecrease: (productId: string) => void;
  onRemove: (productId: string) => void;
  onContinueShopping: () => void;
}

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

const Cart: React.FC<CartPageProps> = ({
  items,
  onIncrease,
  onDecrease,
  onRemove,
  onContinueShopping,
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal;

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-white border-b border-gray-100 py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <ShoppingCart className="w-8 h-8 text-igo-lime" />
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-igo-dark">Your Cart</h1>
          </div>
          <p className="text-igo-muted text-base md:text-lg">
            Review selected products, adjust quantity, and verify totals.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center shadow-sm">
                <h2 className="text-2xl font-black text-igo-dark mb-2">Your cart is empty</h2>
                <p className="text-igo-muted mb-6">Add products from the store to see them here.</p>
                <button
                  type="button"
                  onClick={onContinueShopping}
                  className="bg-igo-dark text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-[0.12em] hover:bg-igo-charcoal transition-colors"
                >
                  Go To Store
                </button>
              </div>
            ) : (
              items.map((item) => {
                const lineTotal = item.product.price * item.quantity;
                return (
                  <article
                    key={item.product.id}
                    className="bg-white rounded-3xl border border-gray-100 p-4 md:p-6 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="w-full sm:w-36 h-36 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.15em] text-igo-muted mb-1">
                              {item.product.category}
                            </div>
                            <h3 className="text-xl font-black text-igo-dark">{item.product.name}</h3>
                            <p className="text-sm text-igo-muted mt-1">{item.product.description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemove(item.product.id)}
                            className="text-igo-muted hover:text-red-600 transition-colors p-2"
                            aria-label={`Remove ${item.product.name}`}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                          <div className="inline-flex items-center bg-gray-100 rounded-xl p-1">
                            <button
                              type="button"
                              onClick={() => onDecrease(item.product.id)}
                              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                              aria-label={`Decrease quantity for ${item.product.name}`}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center text-sm font-black text-igo-dark">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onIncrease(item.product.id)}
                              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                              aria-label={`Increase quantity for ${item.product.name}`}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="text-xs uppercase tracking-[0.12em] font-bold text-igo-muted">
                              Item Total
                            </div>
                            <div className="text-xl font-black text-green-700">{formatCurrency(lineTotal)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          <aside className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm h-fit lg:sticky lg:top-28">
            <h2 className="text-2xl font-black text-igo-dark mb-6">Order Summary</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-igo-muted">Subtotal</span>
                <span className="font-black text-igo-dark">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-igo-muted">Delivery</span>
                <span className="font-black text-igo-dark">Included</span>
              </div>
              <div className="flex items-center justify-between text-base pt-1">
                <span className="font-black text-igo-dark uppercase tracking-[0.1em]">Total</span>
                <span className="font-black text-green-700 text-2xl">{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onContinueShopping}
              className="mt-8 w-full bg-igo-dark text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-[0.12em] hover:bg-igo-charcoal transition-colors"
            >
              Continue Shopping
            </button>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default Cart;
