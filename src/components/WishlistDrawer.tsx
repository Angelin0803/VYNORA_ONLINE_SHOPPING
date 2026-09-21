import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

interface WishlistDrawerProps {
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ onSelectProduct }) => {
  const { wishlist, removeFromWishlist, isWishlistOpen, setIsWishlistOpen } = useWishlist();
  const { addToCart, isWholesaleMode } = useCart();

  if (!isWishlistOpen) return null;

  return (
    <div id="wishlist-drawer-backdrop" className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div id="wishlist-drawer-panel" className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
            <h2 className="text-base font-bold text-slate-900">
              My Saved Wishlist ({wishlist.length})
            </h2>
          </div>
          <button
            id="btn-close-wishlist-drawer"
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-16">
              <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-4 text-rose-400">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Your wishlist is empty</h3>
              <p className="text-xs text-slate-400 max-w-xs mb-6">
                Tap the heart icon on any product in our collections to bookmark your favorites here.
              </p>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Discover Trends
              </button>
            </div>
          ) : (
            wishlist.map((product) => {
              const activePrice = isWholesaleMode ? product.wholesalePrice : product.price;
              return (
                <div
                  key={product.id}
                  className="flex gap-3.5 p-3 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all text-left"
                >
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    onClick={() => {
                      setIsWishlistOpen(false);
                      onSelectProduct(product);
                    }}
                    className="w-20 h-24 object-cover rounded-xl bg-slate-100 shrink-0 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-[10px] uppercase font-bold text-rose-600 truncate">
                          {product.brand}
                        </span>
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4
                        onClick={() => {
                          setIsWishlistOpen(false);
                          onSelectProduct(product);
                        }}
                        className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug cursor-pointer hover:text-rose-600"
                      >
                        {product.title}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                      <span className="text-xs font-black text-slate-900">
                        ₹{activePrice.toLocaleString('en-IN')}
                      </span>

                      <button
                        onClick={() => {
                          addToCart(product);
                          removeFromWishlist(product.id);
                        }}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
