import React, { useState, useEffect } from 'react';
import { ProductCategory } from '../types';
import { Sparkles, ShieldCheck, Truck, Zap, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  onSelectCategory: (cat: ProductCategory) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSelectCategory }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      badge: 'FESTIVE MEGA DEALS',
      title: 'Trending Styles For All Generations',
      subtitle: 'Silk sarees, casual western shirts, kids ethnic wear & comfy elderwear up to 70% OFF',
      category: 'clothes' as ProductCategory,
      cta: 'Explore 50+ Fashion Styles',
      tag: 'Starting from ₹499',
      gradient: 'from-rose-900 via-rose-800 to-amber-900',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      badge: 'URBAN SNEAKERS & FORMALS',
      title: 'Premium Footwear Collection',
      subtitle: 'Air-cushioned sneakers, handcrafted Italian derbys, and ethnic juttis with high-rebound comfort',
      category: 'shoes' as ProductCategory,
      cta: 'Shop 50+ Footwear Picks',
      tag: 'Extra ₹150 Off with FIRST50',
      gradient: 'from-slate-950 via-indigo-950 to-slate-900',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 3,
      badge: 'SMART LIFE & AUDIO',
      title: 'Smartwatches, ANC Earbuds & Fast GaN Hubs',
      subtitle: 'Bluetooth calling AMOLED watches, titanium health rings, and 65W ultra-fast GaN chargers',
      category: 'accessories' as ProductCategory,
      cta: 'Discover Smart Tech',
      tag: '1 Year Full Replacement Warranty',
      gradient: 'from-cyan-950 via-slate-900 to-blue-950',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 4,
      badge: 'AUTHENTIC GLOW & ESSENTIALS',
      title: 'Pure Ayurvedic & Clinical Skincare',
      subtitle: 'Dermatologist tested Niacinamide serums, matte sunscreen gels, and French artisan perfumes',
      category: 'beauty' as ProductCategory,
      cta: 'Shop Clean Beauty',
      tag: 'Free Express Delivery on all orders',
      gradient: 'from-emerald-950 via-teal-950 to-slate-950',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      {/* Dynamic Hero Slide */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${slide.gradient} text-white shadow-xl transition-all duration-700 min-h-[280px] sm:min-h-[320px] flex items-center`}>
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent pointer-events-none" />

        <div className="relative z-10 w-full p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Text */}
          <div className="max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase mb-3 text-amber-300 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{slide.badge}</span>
              <span className="text-white/60">•</span>
              <span className="text-white">{slide.tag}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-2">
              {slide.title}
            </h2>

            <p className="text-sm sm:text-base text-slate-200 mb-5 line-clamp-2">
              {slide.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                id="btn-hero-cta"
                onClick={() => onSelectCategory(slide.category)}
                className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-rose-900/40 transition-all hover:translate-x-0.5"
              >
                <span>{slide.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Express 2-Day Air Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Image Graphic */}
          <div className="relative shrink-0 w-44 h-44 sm:w-64 sm:h-64 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 hidden md:block">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md rounded-lg p-2 text-center text-xs font-bold text-amber-300">
              Vynora Assured Quality
            </div>
          </div>
        </div>

        {/* Carousel Prev/Next Controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-xs transition-colors hidden sm:block"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-xs transition-colors hidden sm:block"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentSlide ? 'w-6 bg-amber-400' : 'w-2 bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Trust Badges Row (Flipkart / Amazon / Meesho assurance) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
        <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
          <div className="p-1.5 bg-rose-100 text-rose-600 rounded-lg shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-800">Wholesale Direct Pricing</p>
            <p className="text-[10px] text-slate-500">Meesho-style manufacturer rates</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
          <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-800">Vynora Assured Quality</p>
            <p className="text-[10px] text-slate-500">7-day hassle-free replacement</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
          <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-800">Express Air Logistics</p>
            <p className="text-[10px] text-slate-500">Live order tracking with OTP</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
          <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-800">SuperCoins Cashback</p>
            <p className="text-[10px] text-slate-500">Earn 5% on every purchase</p>
          </div>
        </div>
      </div>
    </div>
  );
};
