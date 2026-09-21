import React, { useState } from 'react';
import { Product } from '../types';
import { Star, Heart, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onBuyNow
}) => {
  const { addToCart, isWholesaleMode } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const isFavorited = isInWishlist(product.id);
  const displayPrice = isWholesaleMode ? product.wholesalePrice : product.price;

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-rose-400/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Product Image Stage */}
      <div
        className="relative w-full aspect-4/5 bg-slate-100 overflow-hidden"
        onMouseEnter={() => product.images.length > 1 && setCurrentImgIdx(1)}
        onMouseLeave={() => setCurrentImgIdx(0)}
      >
        <img
          src={product.images[currentImgIdx] || product.images[0]}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.isAssured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-900/90 backdrop-blur-md text-amber-300 rounded-md text-[10px] font-bold shadow-xs">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>Assured</span>
            </span>
          )}
          {product.discountPercentage >= 50 && (
            <span className="px-2 py-0.5 bg-rose-600 text-white rounded-md text-[10px] font-black tracking-wide shadow-xs">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`btn-wishlist-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all z-10 ${
            isFavorited
              ? 'bg-rose-50 text-rose-600 shadow-md'
              : 'bg-white/80 hover:bg-white text-slate-500 hover:text-rose-600 shadow-xs backdrop-blur-xs'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick Wholesale Tag if Meesho Mode active */}
        {isWholesaleMode && (
          <div className="absolute bottom-2 left-2 right-2 bg-rose-600/95 text-white backdrop-blur-xs text-[10px] font-bold py-1 px-2 rounded-lg flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 fill-white" /> Wholesale Price
            </span>
            <span>₹{product.wholesalePrice}</span>
          </div>
        )}
      </div>

      {/* Content Info */}
      <div className="p-3.5 flex flex-col flex-1 text-left">
        {/* Brand & Subcategory */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
          <span className="font-semibold text-slate-700 truncate">{product.brand}</span>
          <span className="text-slate-400 capitalize shrink-0 ml-1">{product.subCategory}</span>
        </div>

        {/* Title */}
        <h3 className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-2 leading-snug mb-2 group-hover:text-rose-600 transition-colors">
          {product.title}
        </h3>

        {/* Star Rating & Review Count */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-700 text-white rounded text-[11px] font-bold">
            <span>{product.rating}</span>
            <Star className="w-2.5 h-2.5 fill-white" />
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            ({product.reviewCount.toLocaleString('en-IN')})
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold ml-auto">
            Free Delivery
          </span>
        </div>

        {/* Price & Discount */}
        <div className="mt-auto pt-2 border-t border-slate-100 flex items-baseline gap-2">
          <span className="text-base sm:text-lg font-black text-slate-900">
            ₹{displayPrice.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-slate-400 line-through">
            ₹{product.originalPrice.toLocaleString('en-IN')}
          </span>
          {!isWholesaleMode && (
            <span className="text-[11px] font-bold text-rose-600 ml-auto">
              {product.discountPercentage}% off
            </span>
          )}
        </div>

        {/* Wholesale tier hint if not in wholesale mode */}
        {!isWholesaleMode && (
          <div className="mt-1 text-[10px] text-slate-500 flex items-center justify-between">
            <span className="text-rose-600 font-medium">Wholesale Rate:</span>
            <span className="font-bold text-slate-700">₹{product.wholesalePrice}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-2">
          <button
            id={`btn-card-add-cart-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="w-full py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>

          <button
            id={`btn-card-buy-now-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onBuyNow(product);
            }}
            className="w-full py-2 px-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};
