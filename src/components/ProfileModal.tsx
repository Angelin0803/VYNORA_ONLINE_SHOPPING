import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Package,
  MapPin,
  Coins,
  Truck,
  Plus,
  LogOut,
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { apiClient } from '../services/apiClient';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackOrder: (order: Order) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onTrackOrder
}) => {
  const { user, logout, addAddress, setDefaultAddress } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'rewards'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const [newAddr, setNewAddr] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    pincode: '',
    addressLine: '',
    city: '',
    state: '',
    type: 'home' as 'home' | 'work',
    isDefault: false
  });

  useEffect(() => {
    if (isOpen && user) {
      apiClient.getOrders(user.id).then(res => setOrders(res));
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.addressLine || !newAddr.pincode) return;

    await addAddress(newAddr);
    setIsAddingAddress(false);
    setNewAddr({
      fullName: user.name,
      phone: user.phone,
      pincode: '',
      addressLine: '',
      city: '',
      state: '',
      type: 'home',
      isDefault: false
    });
  };

  return (
    <div id="profile-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div id="profile-modal-card" className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-2xl bg-rose-100 object-cover border-2 border-white/20"
            />
            <div>
              <h2 className="text-lg font-black">{user.name}</h2>
              <p className="text-xs text-slate-300">{user.email} &bull; {user.phone}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-400 text-slate-950 rounded-full text-[11px] font-bold">
                  <Coins className="w-3 h-3" /> {user.superCoins} SuperCoins
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  Vynora Club Member
                </span>
              </div>
            </div>
          </div>
          <button
            id="btn-close-profile-modal"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6">
          <button
            id="tab-profile-orders"
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'orders'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            id="tab-profile-addresses"
            onClick={() => setActiveTab('addresses')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'addresses'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({user.addresses.length})</span>
          </button>

          <button
            id="tab-profile-rewards"
            onClick={() => setActiveTab('rewards')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'rewards'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>SuperCoins & Rewards</span>
          </button>

          <button
            id="btn-profile-logout"
            onClick={() => {
              logout();
              onClose();
            }}
            className="ml-auto my-auto py-1.5 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-left">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Package className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-bold text-slate-700">No orders placed yet</p>
                  <p className="text-xs text-slate-400">Your purchases with express live tracking will appear here.</p>
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-all shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-xs font-bold text-slate-900">{ord.orderNumber}</span>
                        <span className="text-slate-300 mx-2">&bull;</span>
                        <span className="text-xs text-slate-500">{ord.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                        <button
                          onClick={() => {
                            onClose();
                            onTrackOrder(ord);
                          }}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track Delivery</span>
                        </button>
                      </div>
                    </div>

                    {/* Items snippet */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={ord.items[0]?.product.images[0]}
                          alt="Ordered item"
                          className="w-12 h-14 object-cover rounded-lg bg-slate-100"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900 truncate max-w-sm">
                            {ord.items[0]?.product.title}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {ord.items.length > 1 ? `+ ${ord.items.length - 1} more item(s)` : `Qty: ${ord.items[0]?.quantity}`}
                          </p>
                          <p className="text-[10px] text-emerald-600 font-semibold">
                            Tracking: {ord.trackingNumber}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900">₹{ord.totalAmount.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-amber-700 font-semibold">+{ord.superCoinsEarned} Coins</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Manage Delivery Locations
                </h4>
                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                )}
              </div>

              {isAddingAddress && (
                <form onSubmit={handleCreateAddress} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <h5 className="text-xs font-bold text-slate-900">Add New Shipping Address</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Recipient Full Name"
                      value={newAddr.fullName}
                      onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                      className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Mobile Number"
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                      className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="6-digit PIN code"
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="House / Flat / Street Address"
                    value={newAddr.addressLine}
                    onChange={(e) => setNewAddr({ ...newAddr, addressLine: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="City (e.g. Coimbatore)"
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                      className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State (e.g. Tamil Nadu)"
                      value={newAddr.state}
                      onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                      className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-200 rounded-lg"
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
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-4 rounded-2xl border ${
                      addr.isDefault ? 'border-rose-600 bg-rose-50/30' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-900">{addr.fullName}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                        {addr.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-snug">{addr.addressLine}</p>
                    <p className="text-xs text-slate-500">
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Phone: {addr.phone}</p>

                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="mt-3 text-xs font-bold text-rose-600 hover:underline"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REWARDS */}
          {activeTab === 'rewards' && (
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 rounded-2xl text-slate-950 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900/80">
                      Total SuperCoins Balance
                    </span>
                    <h3 className="text-4xl font-black mt-1">{user.superCoins} 🪙</h3>
                    <p className="text-xs font-bold text-slate-900/90 mt-1">
                      Equivalent to ₹{user.superCoins} instant cash discount at checkout
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-black/10 flex items-center justify-center">
                    <Coins className="w-8 h-8 text-slate-950" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                <h5 className="font-bold text-slate-900">How Vynora SuperCoins Work (Like Flipkart & Amazon Pay)</h5>
                <ul className="space-y-1.5 text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Earn 5% flat coins on every purchase across all categories.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Redeem 1 SuperCoin = ₹1.00 directly on your shopping cart.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Coins never expire for verified Vynora Club members.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
