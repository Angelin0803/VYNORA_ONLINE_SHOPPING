import React from 'react';
import { ProductCategory } from '../types';
import {
  Sparkles,
  Shirt,
  Footprints,
  HeartPulse,
  Watch,
  SlidersHorizontal,
  Flame,
  ArrowUpDown
} from 'lucide-react';

interface CategoryNavProps {
  activeCategory: ProductCategory | 'all';
  onSelectCategory: (cat: ProductCategory | 'all') => void;
  activeSubCategory: string;
  onSelectSubCategory: (sub: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  trendingOnly: boolean;
  onToggleTrending: () => void;
  totalCount: number;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
  activeSubCategory,
  onSelectSubCategory,
  sortBy,
  onSortChange,
  trendingOnly,
  onToggleTrending,
  totalCount
}) => {
  const categories: { id: ProductCategory | 'all'; label: string; icon: any; count: string }[] = [
    { id: 'all', label: 'All Categories', icon: Sparkles, count: '208+' },
    { id: 'clothes', label: 'Clothes for All Ages', icon: Shirt, count: '52 Items' },
    { id: 'shoes', label: 'Shoes & Footwear', icon: Footprints, count: '52 Items' },
    { id: 'beauty', label: 'Beauty & Grooming', icon: HeartPulse, count: '52 Items' },
    { id: 'accessories', label: 'Smart Accessories', icon: Watch, count: '52 Items' }
  ];

  const subCategoriesByCategory: Record<string, string[]> = {
    all: ['All', 'Trending Now', 'Top Deals', 'Assured Only', 'Best Sellers'],
    clothes: [
      'All Clothes',
      "Men's Ethnic",
      "Men's Western",
      "Women's Ethnic",
      "Women's Western",
      'Kids Wear (Boys)',
      'Kids Wear (Girls)',
      'Elderly Comfort Wear',
      'Teens Trend'
    ],
    shoes: [
      'All Footwear',
      "Men's Sneakers",
      'Running Shoes',
      'Formal Oxfords',
      'Casual Loafers',
      'Ethnic Juttis',
      "Women's Heels",
      'Kids Sports Shoes'
    ],
    beauty: [
      'All Beauty',
      'Skincare Serums',
      'Face Sunscreen',
      'Lip Care & Makeup',
      'Luxury Perfumes',
      "Men's Beard Care",
      'Ayurvedic Hair Oil'
    ],
    accessories: [
      'All Accessories',
      'Smartwatches',
      'TWS Earbuds',
      'Over-Ear Headphones',
      'Fast Chargers',
      'Power Banks',
      'Smart Rings'
    ]
  };

  const activeSubList = subCategoriesByCategory[activeCategory] || [];

  return (
    <div className="bg-white border-b border-slate-200">
      {/* Category Icons Row (Flipkart / Meesho style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-2 sm:gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-nav-${cat.id}`}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onSelectSubCategory('');
                }}
                className={`group flex items-center gap-2 px-3 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs leading-none font-bold">{cat.label}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{cat.count}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-category Filter Chips & Sort Controls */}
      <div className="bg-slate-50/80 border-t border-slate-100 py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Subcategory Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full">
            {activeSubList.map((sub) => {
              const isAll = sub === 'All' || sub.startsWith('All ');
              const isSelected = isAll ? !activeSubCategory : activeSubCategory === sub;
              return (
                <button
                  key={sub}
                  id={`chip-subcat-${sub.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => onSelectSubCategory(isAll ? '' : sub)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>

          {/* Right Tools: Trending Toggle, Sort Filter, Items Count */}
          <div className="flex items-center gap-2.5 ml-auto shrink-0">
            {/* Trending Toggle */}
            <button
              id="btn-filter-trending"
              onClick={onToggleTrending}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                trendingOnly
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Trending Only</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex items-center bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
              <ArrowUpDown className="w-3 h-3 text-slate-400 mr-1.5" />
              <select
                id="select-sort-products"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-transparent text-slate-700 font-semibold focus:outline-hidden text-xs cursor-pointer"
              >
                <option value="relevance">Sort: Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Customer Ratings</option>
                <option value="discount">Highest Discount %</option>
              </select>
            </div>

            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              ({totalCount} products)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
