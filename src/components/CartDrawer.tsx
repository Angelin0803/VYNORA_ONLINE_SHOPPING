import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Tag,
  ArrowRight,
  ShieldCheck,
  Zap,
  Check,
  Coins
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PROMO_CODES } from '../data/products';

interface CartDrawerProps {
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedCheckout }) => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    wholesaleSavings,
    finalTotal,
    isWholesaleMode,
    toggleWholesaleMode,
    appliedPromo,
    applyPromo,
    removePromo,
    isCartOpen,
    setIsCartOpen
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (code: string) => {
    const res = applyPromo(code);
    setPromoFeedback(res);
    if (res.success) {
      setPromoInput('');
    }
    setTimeout(() => setPromoFeedback(null), 4000);
  };

  return (
    <div id="cart-drawer-backdrop" className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div id="cart-drawer-panel" className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900">
              Shopping Cart ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>
          </div>
          <button
            id="btn-close-cart-drawer"
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wholesale Switch Banner */}
        <div className="bg-rose-50 px-5 py-2.5 border-b border-rose-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-rose-600 fill-rose-600" />
            <span className="font-semibold text-rose-950">Vynora Club Wholesale Pricing</span>
          </div>
          <button
            onClick={toggleWholesaleMode}
            className={`px-2.5 py-1 rounded-full font-bold text-[11px] transition-colors ${
              isWholesaleMode
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            {isWholesaleMode ? 'ACTIVE' : 'ACTIVATE'}
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-16">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Your cart is currently empty</h3>
              <p className="text-xs text-slate-400 max-w-xs mb-6">
                Explore our collections in clothes, footwear, beauty essentials & smart tech to add items.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => {
              const activeItemPrice = isWholesaleMode ? item.product.wholesalePrice : item.product.price;
              return (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all text-left"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-20 h-24 object-cover rounded-xl bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-[10px] uppercase font-bold text-rose-600 truncate">
                          {item.product.brand}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-900 line-clamp-1 leading-snug">
                        {item.product.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {item.selectedSize ? `Size: ${item.selectedSize}` : ''}
                        {item.selectedSize && item.selectedColor ? ' • ' : ''}
                        {item.selectedColor ? `Color: ${item.selectedColor}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                      {/* Quantity buttons */}
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900">
                          ₹{(activeItemPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                        {isWholesaleMode && (
                          <span className="text-[10px] text-emerald-600 block font-semibold">
                            Wholesale saved ₹{(item.product.price - item.product.wholesalePrice) * item.quantity}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Promo Codes & Order Summary (only if items present) */}
        {items.length > 0 && (
          <div className="border-t border-slate-200 p-5 bg-slate-50 space-y-4">
            {/* Coupon Code Section */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-rose-600" /> Apply Vynora Coupon
                </span>
                {appliedPromo && (
                  <button
                    onClick={removePromo}
                    className="text-[11px] text-rose-600 hover:underline font-semibold"
                  >
                    Remove ({appliedPromo.code})
                  </button>
                )}
              </div>

              {!appliedPromo ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="Enter promo code (e.g. VYNORA10)"
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-xl uppercase bg-white focus:outline-hidden focus:border-rose-500"
                    />
                    <button
                      onClick={() => handleApplyPromo(promoInput)}
                      disabled={!promoInput.trim()}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold disabled:opacity-40"
                    >
                      Apply
                    </button>
                  </div>

                  {/* Promo quick chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {PROMO_CODES.map((promo) => (
                      <button
                        key={promo.code}
                        onClick={() => handleApplyPromo(promo.code)}
                        className="px-2 py-0.5 bg-white hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-300 rounded-md text-[10px] font-bold text-slate-700 transition-colors"
                      >
                        %{promo.code}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                  <span className="flex items-center gap-1 font-bold">
                    <Check className="w-3.5 h-3.5" /> Coupon &apos;{appliedPromo.code}&apos; Applied!
                  </span>
                  <span className="font-bold text-emerald-900">
                    {appliedPromo.discountPercent ? `${appliedPromo.discountPercent}% OFF` : `₹${appliedPromo.flatDiscount} OFF`}
                  </span>
                </div>
              )}

              {promoFeedback && !promoFeedback.success && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{promoFeedback.message}</p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {wholesaleSavings > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Wholesale Discount</span>
                  <span>-₹{wholesaleSavings.toLocaleString('en-IN')}</span>
                </div>
              )}

              {appliedPromo && (
                <div className="flex justify-between text-rose-600 font-semibold">
                  <span>Coupon Discount ({appliedPromo.code})</span>
                  <span>-₹{(discount - wholesaleSavings).toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-slate-600">
                <span>Shipping / Express Air</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> FREE
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t border-slate-300 text-slate-900 font-bold text-sm">
                <span>Total Amount</span>
                <span className="text-lg font-black text-slate-900">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>

              {/* SuperCoins Notice */}
              <div className="flex items-center justify-center gap-1 text-[11px] text-amber-800 bg-amber-50 py-1 px-2 rounded-lg font-semibold">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>You will earn {Math.floor(finalTotal * 0.05)} SuperCoins on this order!</span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              id="btn-cart-checkout"
              onClick={() => {
                setIsCartOpen(false);
                onProceedCheckout();
              }}
              className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
