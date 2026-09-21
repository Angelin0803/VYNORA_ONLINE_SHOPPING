import React, { useState } from 'react';
import {
  Search,
  Mic,
  Camera,
  Heart,
  ShoppingCart,
  User,
  MapPin,
  Sparkles,
  GitBranch,
  ChevronDown,
  PackageCheck,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenVoiceSearch: () => void;
  onOpenImageSearch: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenCiCd: () => void;
  onOpenOrders: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenVoiceSearch,
  onOpenImageSearch,
  onOpenAuth,
  onOpenProfile,
  onOpenCiCd,
  onOpenOrders
}) => {
  const { user, logout } = useAuth();
  const { totalItemsCount, finalTotal, setIsCartOpen, isWholesaleMode, toggleWholesaleMode } = useCart();
  const { wishlist, setIsWishlistOpen } = useWishlist();

  const [isPincodeOpen, setIsPincodeOpen] = useState(false);
  const [customPincode, setCustomPincode] = useState('641001');
  const [activeCity, setActiveCity] = useState('Coimbatore');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPincode.length === 6) {
      const city = customPincode.startsWith('6') ? 'Coimbatore/Chennai' :
                   customPincode.startsWith('5') ? 'Bengaluru' :
                   customPincode.startsWith('4') ? 'Mumbai' : 'Delhi NCR';
      setActiveCity(city);
      setIsPincodeOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top micro-bar: SuperCoins & Wholesale Notice */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" /> Vynora SuperSaver Days
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300">
              Get up to 70% Off + Extra 5% SuperCoins on Prepaid Orders
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Meesho Wholesale Mode Toggle */}
            <button
              id="btn-toggle-wholesale-mode"
              onClick={toggleWholesaleMode}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium transition-all text-[11px] ${
                isWholesaleMode
                  ? 'bg-rose-500 text-white font-bold shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <span>Wholesale Pricing (Meesho Mode)</span>
              <span className={`w-2 h-2 rounded-full ${isWholesaleMode ? 'bg-white' : 'bg-slate-500'}`} />
            </button>

            {/* CI/CD Pipeline & VS Code modal trigger */}
            <button
              id="btn-open-cicd-modal"
              onClick={onOpenCiCd}
              className="hidden sm:flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>CI/CD & VS Code ZIP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSearchChange('');
            }}
            className="group flex items-center gap-2"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-rose-200">
              V
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
                VYNORA
              </span>
              <span className="hidden sm:block text-[9px] uppercase tracking-widest text-slate-400 font-semibold -mt-1">
                Fashion &bull; Tech &bull; Living
              </span>
            </div>
          </a>

          {/* Delivery Pincode Dropdown */}
          <div className="relative hidden lg:block">
            <button
              id="btn-pincode-selector"
              onClick={() => setIsPincodeOpen(!isPincodeOpen)}
              className="flex items-center gap-1.5 text-left px-2.5 py-1.5 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-colors"
            >
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-medium leading-none">Deliver to</p>
                <p className="text-xs font-bold text-slate-800 flex items-center gap-0.5 leading-tight">
                  {activeCity} {customPincode}
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </p>
              </div>
            </button>

            {isPincodeOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-3.5 z-50">
                <p className="text-xs font-bold text-slate-800 mb-1">Select Delivery Location</p>
                <p className="text-[11px] text-slate-500 mb-2.5">
                  Enter 6-digit Indian PIN code to check express delivery dates and COD availability
                </p>
                <form onSubmit={handlePincodeSubmit} className="flex gap-1.5">
                  <input
                    type="text"
                    maxLength={6}
                    value={customPincode}
                    onChange={(e) => setCustomPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 560001"
                    className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-rose-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
                  >
                    Apply
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Omnichannel Search Bar (Text + Voice + Image Visual Lens) */}
        <div className="flex-1 max-w-2xl relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
            <input
              id="main-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search 200+ clothes, sneakers, beauty serums, smartwatches..."
              className="w-full pl-10 pr-20 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-rose-500 rounded-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 transition-all"
            />
            {/* Voice & Image Search buttons right inside searchbar */}
            <div className="absolute right-2 flex items-center gap-1">
              <button
                id="btn-navbar-voice-search"
                onClick={onOpenVoiceSearch}
                title="Search by Voice"
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                aria-label="Voice Search"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                id="btn-navbar-image-search"
                onClick={onOpenImageSearch}
                title="Search by Image Lens"
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                aria-label="Image Search"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Actions: Wishlist, Cart, Profile */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          {/* SuperCoins Badge */}
          {user && (
            <div
              title="Your Vynora SuperCoins Balance"
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-800"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>{user.superCoins} Coins</span>
            </div>
          )}

          {/* Wishlist */}
          <button
            id="btn-navbar-wishlist"
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2 text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            id="btn-navbar-cart"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm transition-all"
            aria-label="Shopping Cart"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-amber-400 text-slate-900 text-[10px] font-black rounded-full flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-bold">
              {totalItemsCount > 0 ? `₹${finalTotal.toLocaleString('en-IN')}` : 'Cart'}
            </span>
          </button>

          {/* User Profile / Auth */}
          {user ? (
            <div className="relative">
              <button
                id="btn-user-profile-menu"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full border border-slate-200 hover:border-rose-400 transition-colors"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover bg-rose-100"
                />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <div className="mt-1.5 flex items-center justify-between text-[11px] bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md font-semibold">
                      <span>SuperCoins</span>
                      <span>{user.superCoins} 🪙</span>
                    </div>
                  </div>

                  <button
                    id="menu-item-profile"
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      onOpenProfile();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" /> My Profile & Addresses
                  </button>

                  <button
                    id="menu-item-orders"
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      onOpenOrders();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2"
                  >
                    <PackageCheck className="w-4 h-4" /> My Orders & Tracking
                  </button>

                  <button
                    id="menu-item-cicd"
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      onOpenCiCd();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2"
                  >
                    <GitBranch className="w-4 h-4" /> CI/CD & VS Code Project ZIP
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    id="menu-item-logout"
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              id="btn-login-trigger"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-300 hover:border-rose-500 text-slate-700 hover:text-rose-600 rounded-xl text-xs font-bold transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
