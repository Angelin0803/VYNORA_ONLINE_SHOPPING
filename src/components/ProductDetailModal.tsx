import React, { useState, useEffect } from 'react';
import { Product, Review } from '../types';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  Heart,
  ShoppingBag,
  Zap,
  CheckCircle2,
  ThumbsUp,
  MessageSquarePlus,
  RefreshCw,
  Coins
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/apiClient';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product, size?: string, color?: string, quantity?: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onBuyNow
}) => {
  const { addToCart, isWholesaleMode } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('641001');
  const [pincodeResult, setPincodeResult] = useState<{ deliveryDate: string; isCodAvailable: boolean } | null>(null);
  const [isCheckingPin, setIsCheckingPin] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!product) return;
    setActiveImageIdx(0);
    setSelectedSize(product.sizes && product.sizes.length ? product.sizes[0] : '');
    setSelectedColor(product.colors && product.colors.length ? product.colors[0].name : '');
    setQuantity(1);

    // Initial check pincode
    handleCheckPincode('641001');

    // Fetch reviews
    apiClient.getProductById(product.id).then(res => {
      if (res?.reviews) {
        setReviews(res.reviews);
      }
    });
  }, [product]);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const activePrice = isWholesaleMode ? product.wholesalePrice : product.price;

  const handleCheckPincode = async (code: string) => {
    if (code.length !== 6) return;
    setIsCheckingPin(true);
    try {
      const res = await apiClient.checkPincode(code);
      setPincodeResult(res);
    } finally {
      setIsCheckingPin(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const rev = await apiClient.submitReview({
        productId: product.id,
        userName: user ? user.name : 'Verified Shopper',
        rating: newRating,
        title: newTitle,
        comment: newComment
      });

      setReviews(prev => [rev, ...prev]);
      setReviewSuccessMsg('Your verified customer review has been posted!');
      setNewTitle('');
      setNewComment('');
      setIsReviewFormOpen(false);

      setTimeout(() => setReviewSuccessMsg(null), 4000);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleHelpfulUpvote = (revId: string) => {
    setReviews(prev =>
      prev.map(r => (r.id === revId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
    fetch(`/api/reviews/${revId}/helpful`, { method: 'POST' }).catch(() => {});
  };

  // Star breakdown calculation
  const totalReviews = reviews.length || 1;
  const rating5 = reviews.filter(r => r.rating === 5).length;
  const rating4 = reviews.filter(r => r.rating === 4).length;
  const rating3 = reviews.filter(r => r.rating === 3).length;
  const rating2 = reviews.filter(r => r.rating === 2).length;
  const rating1 = reviews.filter(r => r.rating === 1).length;

  return (
    <div id="product-detail-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div id="product-detail-modal-card" className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
              {product.brand} &bull; {product.category}
            </span>
            {product.isAssured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Vynora Assured
              </span>
            )}
          </div>
          <button
            id="btn-close-product-detail"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Product Images & Thumbnails (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                <img
                  src={product.images[activeImageIdx] || product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover object-center"
                />
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-3 right-3 p-2.5 rounded-full shadow-md transition-all ${
                    isFavorited
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-white/80 hover:bg-white text-slate-500 hover:text-rose-600'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-600' : ''}`} />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIdx === idx ? 'border-rose-600 shadow-sm' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* SuperCoins Cash Reward Box */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-xl text-amber-700">
                  <Coins className="w-5 h-5" />
                </div>
                <div className="text-left text-xs">
                  <p className="font-bold text-amber-950">Earn {Math.floor(activePrice * 0.05)} Vynora SuperCoins</p>
                  <p className="text-amber-800">5% cashback credited immediately upon successful delivery.</p>
                </div>
              </div>
            </div>

            {/* Right: Product Details & Purchase Form (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div>
                <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">{product.brand}</p>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{product.title}</h1>

                <div className="flex items-center gap-3 mt-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-700 text-white rounded-lg text-xs font-bold">
                    <span>{product.rating}</span>
                    <Star className="w-3 h-3 fill-white" />
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {product.reviewCount.toLocaleString('en-IN')} Ratings & Verified Reviews
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold ml-auto flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({product.stock} units)
                  </span>
                </div>
              </div>

              {/* Price Row & Wholesale Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-900">
                    ₹{activePrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-slate-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-bold text-rose-600">
                    {product.discountPercentage}% OFF
                  </span>
                </div>

                {/* Meesho Reseller Wholesale Banner */}
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-semibold">Vynora Club Wholesale Tier:</span>
                    <span className="font-bold text-slate-900">₹{product.wholesalePrice}</span>
                  </div>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Save ₹{product.price - product.wholesalePrice}
                  </span>
                </div>
              </div>

              {/* Available Sizes (if applicable) */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Select Size / Volume
                    </label>
                    <span className="text-xs text-rose-600 font-medium cursor-pointer hover:underline">
                      Size & Fit Guide
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        id={`btn-select-size-${sz.toLowerCase()}`}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                          selectedSize === sz
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                    Color: <span className="font-semibold text-rose-600">{selectedColor || product.colors[0].name}</span>
                  </label>
                  <div className="flex items-center gap-2.5">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 ${
                          selectedColor === c.name ? 'border-rose-600 scale-110 shadow-md' : 'border-transparent'
                        }`}
                        title={c.name}
                      >
                        <span
                          className="w-full h-full rounded-full block border border-black/10"
                          style={{ backgroundColor: c.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-bold text-slate-900 min-w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-slate-500">
                    Total: <strong className="text-slate-900">₹{(activePrice * quantity).toLocaleString('en-IN')}</strong>
                  </span>
                </div>
              </div>

              {/* Pincode Delivery Estimator */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Truck className="w-4 h-4 text-rose-600" />
                    <span>Delivery Details & Pincode Checker</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit Pincode"
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-rose-500 bg-white"
                  />
                  <button
                    onClick={() => handleCheckPincode(pincode)}
                    disabled={isCheckingPin || pincode.length !== 6}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold disabled:opacity-50"
                  >
                    {isCheckingPin ? 'Checking...' : 'Check'}
                  </button>
                </div>

                {pincodeResult && (
                  <div className="mt-3 pt-3 border-t border-slate-200 text-xs space-y-1">
                    <p className="text-emerald-700 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Delivery by {pincodeResult.deliveryDate}
                    </p>
                    <p className="text-slate-600">
                      &bull; Cash on Delivery Available &bull; 7 Days Free Replacement Guarantee
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  id="btn-detail-add-cart"
                  onClick={() => {
                    addToCart(product, selectedSize, selectedColor, quantity);
                    onClose();
                  }}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  id="btn-detail-buy-now"
                  onClick={() => {
                    onBuyNow(product, selectedSize, selectedColor, quantity);
                    onClose();
                  }}
                  className="py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-rose-600/20"
                >
                  Buy Now &bull; Express Checkout
                </button>
              </div>

              {/* Description & Features */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">About Product</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{product.description}</p>
                <ul className="text-xs text-slate-600 space-y-1.5">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specifications Table */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">Specifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specifications).map(([k, v]) => (
                    <div key={k} className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-slate-400 block font-medium">{k}</span>
                      <span className="font-semibold text-slate-800">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* REVIEWS & RATINGS SECTION */}
          {/* ----------------------------------------------------------------- */}
          <div className="pt-8 border-t border-slate-200 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Customer Ratings & Reviews</h3>
                <p className="text-xs text-slate-500">Authentic reviews verified from confirmed purchases</p>
              </div>

              <button
                id="btn-open-review-form"
                onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors self-start sm:self-auto"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Rate & Review Product</span>
              </button>
            </div>

            {reviewSuccessMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{reviewSuccessMsg}</span>
              </div>
            )}

            {/* Ratings Overview Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-200 mb-6">
              {/* Overall Score */}
              <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 bg-white rounded-xl border border-slate-200/80">
                <span className="text-4xl font-black text-slate-900 leading-none mb-2">
                  {product.rating}
                </span>
                <div className="flex items-center gap-1 text-amber-500 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Based on {product.reviewCount} user evaluations
                </span>
              </div>

              {/* Progress Bars */}
              <div className="md:col-span-8 flex flex-col justify-center space-y-1.5">
                {[
                  { star: 5, count: rating5 },
                  { star: 4, count: rating4 },
                  { star: 3, count: rating3 },
                  { star: 2, count: rating2 },
                  { star: 1, count: rating1 }
                ].map(({ star, count }) => {
                  const pct = Math.round((count / totalReviews) * 100);
                  return (
                    <div key={star} className="flex items-center gap-3 text-xs">
                      <span className="w-8 font-semibold text-slate-700 flex items-center gap-0.5">
                        {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      </span>
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${star >= 4 ? 'bg-emerald-600' : star === 3 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-12 text-right text-slate-500 font-medium">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Write Review Form */}
            {isReviewFormOpen && (
              <form onSubmit={handleAddReview} className="p-5 bg-rose-50/50 border border-rose-200 rounded-2xl mb-6 space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Write Your Customer Review</h4>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setNewRating(num)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${num <= newRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">
                      {newRating} / 5 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Review Headline</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Excellent fit and supreme fabric quality!"
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-rose-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Feedback</label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    placeholder="Describe comfort, durability, delivery experience, or size accuracy..."
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-rose-500 bg-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReviewFormOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold disabled:opacity-50"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-white border border-slate-200/80 rounded-2xl">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rev.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(rev.userName)}`}
                        alt={rev.userName}
                        className="w-7 h-7 rounded-full bg-slate-100 object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{rev.userName}</p>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-700 text-white rounded text-[10px] font-bold">
                      <span>{rev.rating}</span>
                      <Star className="w-2.5 h-2.5 fill-white" />
                    </span>
                    <h5 className="text-xs font-bold text-slate-800">{rev.title}</h5>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">{rev.comment}</p>

                  <button
                    onClick={() => handleHelpfulUpvote(rev.id)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-rose-600 transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({rev.helpfulCount})</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
