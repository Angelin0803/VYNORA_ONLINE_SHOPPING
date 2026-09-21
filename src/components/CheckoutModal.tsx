import React, { useState } from 'react';
import {
  X,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Plus,
  Coins,
  ArrowRight,
  Smartphone
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Address, Order } from '../types';
import { apiClient } from '../services/apiClient';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const {
    items,
    directCheckoutItem,
    finalTotal,
    discount,
    subtotal,
    clearCart,
    setDirectCheckoutItem
  } = useCart();
  const { user, addAddress } = useAuth();

  const checkoutItems = directCheckoutItem ? [directCheckoutItem] : items;

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    pincode: '641001',
    addressLine: '',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    type: 'home' as 'home' | 'work',
    isDefault: false
  });

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [useSuperCoins, setUseSuperCoins] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  // Calculate SuperCoins discount
  const availableCoins = user?.superCoins || 0;
  const maxCoinsUsable = Math.min(availableCoins, 100, Math.floor(finalTotal * 0.3));
  const coinsDiscount = useSuperCoins ? maxCoinsUsable : 0;
  const payableTotal = Math.max(0, finalTotal - coinsDiscount);

  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.addressLine || !newAddr.pincode) return;

    await addAddress(newAddr);
    setIsAddingNewAddress(false);
    setSelectedAddressIndex((user?.addresses.length || 1) - 1);
  };

  const handlePlaceOrder = async () => {
    if (!checkoutItems.length) return;
    setIsPlacingOrder(true);

    try {
      const selectedAddr = user?.addresses[selectedAddressIndex] || {
        id: 'addr-temp',
        fullName: newAddr.fullName || 'Vynora Customer',
        phone: newAddr.phone || '+91 98765 43210',
        pincode: newAddr.pincode || '641001',
        addressLine: newAddr.addressLine || '104, Residency Road',
        city: newAddr.city || 'Coimbatore',
        state: newAddr.state || 'Tamil Nadu',
        isDefault: true,
        type: 'home' as const
      };

      const orderPayload = {
        items: checkoutItems,
        shippingAddress: selectedAddr,
        paymentMethod,
        totalAmount: payableTotal,
        discountAmount: discount + coinsDiscount,
        superCoinsUsed: useSuperCoins ? maxCoinsUsable : 0
      };

      const created = await apiClient.createOrder(orderPayload, user?.id);
      setPlacedOrder(created);
      clearCart();
      setDirectCheckoutItem(null);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div id="checkout-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div id="checkout-modal-card" className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              Vynora Secure Checkout
            </h2>
          </div>
          <button
            id="btn-close-checkout"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
          {placedOrder ? (
            /* Order Success State */
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-emerald-600 tracking-wider">
                  Order Successfully Placed!
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  Thank you, {user?.name || 'Shopper'}!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Order ID: <strong className="text-slate-800">{placedOrder.orderNumber}</strong> &bull; Tracking ID: <strong className="text-slate-800">{placedOrder.trackingNumber}</strong>
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Delivery</span>
                  <span className="font-bold text-emerald-700">{placedOrder.estimatedDeliveryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Status</span>
                  <span className="font-bold uppercase text-slate-800">
                    {placedOrder.paymentMethod.toUpperCase()} ({placedOrder.paymentStatus})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Paid</span>
                  <span className="font-bold text-slate-900">₹{placedOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-amber-700 bg-amber-50/80 p-1.5 rounded-lg font-semibold">
                  <span>SuperCoins Earned</span>
                  <span>+{placedOrder.superCoinsEarned} 🪙</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  id="btn-view-placed-order-tracking"
                  onClick={() => {
                    onClose();
                    onOrderSuccess(placedOrder);
                  }}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>Live Track My Delivery</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Flow */
            <>
              {/* Order Items Preview */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Items in Order ({checkoutItems.reduce((acc, i) => acc + i.quantity, 0)})
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {checkoutItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2.5 p-2 bg-slate-50 border border-slate-200 rounded-xl shrink-0 max-w-xs"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-12 h-14 object-cover rounded-lg bg-white shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{item.product.title}</p>
                        <p className="text-[11px] text-slate-500">
                          Qty: {item.quantity} &bull; ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 1. Shipping Address */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-600" />
                    <span>1. Delivery Address</span>
                  </h3>
                  {!isAddingNewAddress && (
                    <button
                      onClick={() => setIsAddingNewAddress(true)}
                      className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add New Address
                    </button>
                  )}
                </div>

                {isAddingNewAddress ? (
                  <form onSubmit={handleSaveNewAddress} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={newAddr.fullName}
                          onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Phone Number</label>
                        <input
                          type="text"
                          required
                          value={newAddr.phone}
                          onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Pincode (6-digit)</label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={newAddr.pincode}
                        onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Flat / House / Street Address</label>
                      <input
                        type="text"
                        required
                        value={newAddr.addressLine}
                        onChange={(e) => setNewAddr({ ...newAddr, addressLine: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={newAddr.city}
                          onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">State</label>
                        <input
                          type="text"
                          required
                          value={newAddr.state}
                          onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingNewAddress(false)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(user?.addresses || []).map((addr, idx) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressIndex(idx)}
                        className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                          selectedAddressIndex === idx
                            ? 'border-rose-600 bg-rose-50/40 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900">{addr.fullName}</span>
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                            {addr.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">{addr.addressLine}</p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">Mobile: {addr.phone}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Payment Method */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-rose-600" />
                  <span>2. Payment Option</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                      paymentMethod === 'upi' ? 'border-rose-600 bg-rose-50/40' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-rose-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">UPI Instant Pay</p>
                      <p className="text-[10px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                      paymentMethod === 'card' ? 'border-rose-600 bg-rose-50/40' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Credit / Debit Card</p>
                      <p className="text-[10px] text-slate-500">Visa, Mastercard, RuPay</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                      paymentMethod === 'netbanking' ? 'border-rose-600 bg-rose-50/40' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Net Banking</p>
                      <p className="text-[10px] text-slate-500">All Indian Scheduled Banks</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                      paymentMethod === 'cod' ? 'border-rose-600 bg-rose-50/40' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <Truck className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</p>
                      <p className="text-[10px] text-slate-500">Pay cash/UPI at doorstep</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* 3. SuperCoins Redemption Option */}
              {availableCoins > 0 && (
                <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Coins className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="text-xs font-bold text-amber-950">
                        Redeem Vynora SuperCoins ({availableCoins} available)
                      </p>
                      <p className="text-[10px] text-amber-800">
                        Use {maxCoinsUsable} coins to get instant ₹{maxCoinsUsable} discount
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={useSuperCoins}
                    onChange={(e) => setUseSuperCoins(e.target.checked)}
                    className="w-4 h-4 accent-rose-600 cursor-pointer"
                  />
                </div>
              )}

              {/* Order Summary Breakdown */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Store Discounts</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {useSuperCoins && coinsDiscount > 0 && (
                  <div className="flex justify-between text-amber-800 font-semibold">
                    <span>SuperCoins Discount</span>
                    <span>-₹{coinsDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Delivery Fee</span>
                  <span className="text-emerald-700 font-bold">FREE</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-300 text-slate-900 font-bold text-base">
                  <span>Payable Total</span>
                  <span className="text-xl font-black text-slate-900">
                    ₹{payableTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                id="btn-confirm-place-order"
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <span>{isPlacingOrder ? 'Confirming & Placing Order...' : `Pay ₹${payableTotal.toLocaleString('en-IN')} & Place Order`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
