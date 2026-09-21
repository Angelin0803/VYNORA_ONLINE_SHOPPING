import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Product, ProductCategory, CategoryFilter, Order } from './types';
import { apiClient } from './services/apiClient';
import { PRODUCTS } from './data/products';

import { Navbar } from './components/Navbar';
import { CategoryNav } from './components/CategoryNav';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { ImageSearchModal } from './components/ImageSearchModal';
import { CiCdPipelineModal } from './components/CiCdPipelineModal';

import {
  Sparkles,
  ShieldCheck,
  Truck,
  FolderArchive,
  GitBranch,
  X,
  Search,
  Zap
} from 'lucide-react';

function VynoraMainApp() {
  // Navigation & Search State
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [filterTrendingOnly, setFilterTrendingOnly] = useState(false);
  const [filterAssuredOnly, setFilterAssuredOnly] = useState(false);
  const [filterUnder500, setFilterUnder500] = useState(false);

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [isCiCdOpen, setIsCiCdOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Products Data
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [, setIsLoadingProducts] = useState(false);

  const { setDirectCheckoutItem, isWholesaleMode } = useCart();
  const { user } = useAuth();

  // Load products on mount or category change
  useEffect(() => {
    let isMounted = true;
    setIsLoadingProducts(true);

    apiClient.getProducts({
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      q: searchQuery
    }).then(res => {
      if (isMounted && res?.products && res.products.length > 0) {
        setProducts(res.products);
      }
    }).catch(() => {
      // Fallback already in memory
    }).finally(() => {
      if (isMounted) setIsLoadingProducts(false);
    });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, searchQuery]);

  // Filtered and sorted products
  const displayedProducts = useMemo(() => {
    let list: Product[] = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((p: Product) => p.category === selectedCategory);
    }

    // Subcategory filter
    if (selectedSubCategory && selectedSubCategory.trim() !== '') {
      list = list.filter((p: Product) => p.subCategory.toLowerCase() === selectedSubCategory.toLowerCase());
    }

    // Text search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p: Product) =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Filters
    if (filterTrendingOnly) {
      list = list.filter((p: Product) => p.isTrending);
    }
    if (filterAssuredOnly) {
      list = list.filter((p: Product) => p.isAssured);
    }
    if (filterUnder500) {
      list = list.filter((p: Product) => (isWholesaleMode ? p.wholesalePrice : p.price) <= 500);
    }

    // Sorting
    if (sortBy === 'price_low') {
      list.sort((a, b) => (isWholesaleMode ? a.wholesalePrice - b.wholesalePrice : a.price - b.price));
    } else if (sortBy === 'price_high') {
      list.sort((a, b) => (isWholesaleMode ? b.wholesalePrice - a.wholesalePrice : b.price - a.price));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'discount') {
      list.sort((a, b) => b.discountPercentage - a.discountPercentage);
    }

    return list;
  }, [products, selectedCategory, selectedSubCategory, searchQuery, filterTrendingOnly, filterAssuredOnly, filterUnder500, sortBy, isWholesaleMode]);

  // Direct Buy Now Handler
  const handleBuyNow = (product: Product, size?: string, color?: string, quantity: number = 1) => {
    setDirectCheckoutItem({
      id: `${product.id}-${size || 'std'}-${color || 'std'}-${Date.now()}`,
      product,
      quantity,
      selectedSize: size || (product.sizes && product.sizes[0]),
      selectedColor: color || (product.colors && product.colors[0]?.name)
    });
    setIsCheckoutOpen(true);
  };

  // Open Tracking for specific order
  const handleOpenTracking = (order: Order) => {
    setActiveTrackingOrder(order);
    setIsTrackingOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-rose-500 selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white text-[11px] sm:text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-3">
        <span className="flex items-center gap-1 text-amber-300 font-bold">
          <Sparkles className="w-3.5 h-3.5" /> FESTIVE MEGA SALE IS LIVE
        </span>
        <span className="hidden md:inline text-slate-300">|</span>
        <span className="hidden md:inline text-slate-200">
          Use code <strong className="text-amber-300">FIRST50</strong> for extra ₹150 OFF
        </span>
        <span className="text-slate-300">|</span>
        <span className="text-emerald-400 font-bold flex items-center gap-1">
          <Truck className="w-3.5 h-3.5" /> Free Express Air Delivery
        </span>
      </div>

      {/* Main Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenVoiceSearch={() => setIsVoiceModalOpen(true)}
        onOpenImageSearch={() => setIsImageModalOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenCiCd={() => setIsCiCdOpen(true)}
        onOpenOrders={() => setIsProfileOpen(true)}
      />

      {/* Category Navigation Bar (All, Clothes 50+, Shoes 50+, Beauty 50+, Smart Accessories 50+) */}
      <CategoryNav
        activeCategory={selectedCategory}
        onSelectCategory={(cat: CategoryFilter) => {
          setSelectedCategory(cat);
          setSelectedSubCategory('');
        }}
        activeSubCategory={selectedSubCategory}
        onSelectSubCategory={(sub: string) => setSelectedSubCategory(sub)}
        sortBy={sortBy}
        onSortChange={(sort: string) => setSortBy(sort)}
        trendingOnly={filterTrendingOnly}
        onToggleTrending={() => setFilterTrendingOnly(!filterTrendingOnly)}
        totalCount={displayedProducts.length}
      />

      {/* Hero Banner with Auto-Carousel */}
      <HeroBanner onSelectCategory={(cat: ProductCategory) => setSelectedCategory(cat)} />

      {/* Quick Filter Badges Bar */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-2">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Filters:</span>
            <button
              onClick={() => setFilterAssuredOnly(!filterAssuredOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1 ${
                filterAssuredOnly
                  ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Vynora Assured</span>
            </button>

            <button
              onClick={() => setFilterUnder500(!filterUnder500)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                filterUnder500
                  ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              Budget Picks: Under ₹500
            </button>
          </div>

          <div className="text-xs text-slate-500 font-semibold">
            Showing <strong className="text-slate-900">{displayedProducts.length}</strong> items
          </div>
        </div>
      </div>

      {/* Active Filter Indicators */}
      {(searchQuery || selectedSubCategory || filterTrendingOnly || filterAssuredOnly || filterUnder500) && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-1 flex items-center gap-2 flex-wrap text-xs">
          <span className="font-semibold text-slate-500">Active Filters:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg">
              Search: &quot;{searchQuery}&quot;
              <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedSubCategory && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg">
              Subcategory: {selectedSubCategory}
              <button onClick={() => setSelectedSubCategory('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filterTrendingOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg">
              Trending Only
              <button onClick={() => setFilterTrendingOnly(false)}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filterAssuredOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg">
              Assured Only
              <button onClick={() => setFilterAssuredOnly(false)}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filterUnder500 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg">
              Under ₹500
              <button onClick={() => setFilterUnder500(false)}><X className="w-3 h-3" /></button>
            </span>
          )}
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSubCategory('');
              setFilterTrendingOnly(false);
              setFilterAssuredOnly(false);
              setFilterUnder500(false);
            }}
            className="text-xs text-rose-600 font-bold hover:underline ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Product Listing Main Section */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1">
        {/* Results Title & Count */}
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 capitalize flex items-center gap-2">
            <span>
              {selectedCategory === 'all' ? 'All Trending Products' : `${selectedCategory} Collection`}
            </span>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {displayedProducts.length} Items Available
            </span>
          </h2>
          {isWholesaleMode && (
            <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-rose-600" /> Meesho Wholesale Tier Active
            </span>
          )}
        </div>

        {/* Products Grid */}
        {displayedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center my-6 max-w-md mx-auto">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">No products found</h3>
            <p className="text-xs text-slate-500 mb-4">
              We couldn&apos;t find any items matching your selected criteria or search query.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSubCategory('');
                setSearchQuery('');
                setFilterTrendingOnly(false);
                setFilterAssuredOnly(false);
                setFilterUnder500(false);
              }}
              className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors"
            >
              Reset Filters & Browse All
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {displayedProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onBuyNow={(p) => handleBuyNow(p)}
              />
            ))}
          </div>
        )}
      </main>

      {/* CI/CD Pipeline Sticky Banner */}
      <div className="sticky bottom-4 z-30 max-w-md mx-auto px-4 w-full">
        <div className="p-3 bg-slate-950/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <GitBranch className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-black tracking-tight">Online Shopping CI/CD Pipeline</p>
              <p className="text-[10px] text-slate-400">Docker &bull; GitHub Actions &bull; Express REST</p>
            </div>
          </div>

          <button
            id="btn-sticky-cicd"
            onClick={() => setIsCiCdOpen(true)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0"
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span>Get Project ZIP</span>
          </button>
        </div>
      </div>

      {/* Professional Footer */}
      <footer className="bg-slate-900 text-white pt-12 pb-8 border-t border-slate-800 mt-12 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
            {/* Col 1: Brand & Promise */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-md">
                  V
                </div>
                <span className="text-2xl font-black tracking-tight text-white">VYNORA</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                India&apos;s leading online shopping and wholesale reselling destination. Combining Flipkart&apos;s SuperCoins, Amazon&apos;s assured express logistics, and Meesho&apos;s manufacturer direct wholesale prices.
              </p>
              <div className="flex items-center gap-2 pt-1 text-xs text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" /> 100% Genuine &amp; Quality Assured
              </div>
            </div>

            {/* Col 2: Categories */}
            <div className="space-y-2 text-xs">
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-200 mb-3">Shop Categories</h4>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => setSelectedCategory('clothes')} className="hover:text-rose-400">Fashion &amp; Clothes (50+)</button></li>
                <li><button onClick={() => setSelectedCategory('shoes')} className="hover:text-rose-400">Sneakers &amp; Footwear (50+)</button></li>
                <li><button onClick={() => setSelectedCategory('beauty')} className="hover:text-rose-400">Beauty &amp; Personal Care (50+)</button></li>
                <li><button onClick={() => setSelectedCategory('accessories')} className="hover:text-rose-400">Smartwatches &amp; Tech (50+)</button></li>
              </ul>
            </div>

            {/* Col 3: Customer Care */}
            <div className="space-y-2 text-xs">
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-200 mb-3">Customer Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => setIsTrackingOpen(true)} className="hover:text-rose-400">Track Your Order</button></li>
                <li><button onClick={() => setIsProfileOpen(true)} className="hover:text-rose-400">Manage Delivery Addresses</button></li>
                <li><button onClick={() => setIsProfileOpen(true)} className="hover:text-rose-400">Vynora SuperCoins Program</button></li>
                <li className="text-slate-300 font-medium">Toll Free: 1800-420-VYNORA</li>
                <li className="text-slate-300 font-medium">Email: support@vynora.in</li>
              </ul>
            </div>

            {/* Col 4: CI/CD Pipeline & VS Code */}
            <div className="space-y-3 text-xs">
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-200 mb-3">CI/CD Pipeline Project</h4>
              <p className="text-slate-400 text-xs">
                Built with GitHub Actions automated CI/CD pipeline, Docker multi-stage containerization, and Express full-stack API.
              </p>
              <button
                onClick={() => setIsCiCdOpen(true)}
                className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <FolderArchive className="w-4 h-4 text-amber-400" />
                <span>Export VS Code Project ZIP</span>
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <p>&copy; {new Date().getFullYear()} Vynora Online Shopping Inc. All rights reserved.</p>
            <p>Designed for Excellence &bull; Continuous Integration &amp; Continuous Deployment</p>
          </div>
        </div>
      </footer>

      {/* ----------------- MODALS & DRAWERS ----------------- */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={(prod, size, color, qty) => handleBuyNow(prod, size, color, qty)}
      />

      <CartDrawer
        onProceedCheckout={() => setIsCheckoutOpen(true)}
      />

      <WishlistDrawer
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(order) => handleOpenTracking(order)}
      />

      <OrderTrackingModal
        order={activeTrackingOrder}
        onClose={() => setIsTrackingOpen(false)}
        onOrderUpdated={(updated) => setActiveTrackingOrder(updated)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onTrackOrder={(ord) => handleOpenTracking(ord)}
      />

      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSearch={(q: string) => setSearchQuery(q)}
      />

      <ImageSearchModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onVisualSearch={(detectedTerm: string, detectedCat: string) => {
          setSearchQuery(detectedTerm);
          if (detectedCat === 'clothes' || detectedCat === 'shoes' || detectedCat === 'beauty' || detectedCat === 'accessories') {
            setSelectedCategory(detectedCat);
          }
        }}
      />

      <CiCdPipelineModal
        isOpen={isCiCdOpen}
        onClose={() => setIsCiCdOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <VynoraMainApp />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
