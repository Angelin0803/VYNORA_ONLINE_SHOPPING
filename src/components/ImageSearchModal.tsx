import React, { useState } from 'react';
import { Camera, Upload, X, Check, Image as ImageIcon } from 'lucide-react';

interface ImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVisualSearch: (detectedTerm: string, detectedCategory: string) => void;
}

export const ImageSearchModal: React.FC<ImageSearchModalProps> = ({
  isOpen,
  onClose,
  onVisualSearch
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedCategory, setDetectedCategory] = useState<string | null>(null);
  const [detectedKeyword, setDetectedKeyword] = useState<string | null>(null);

  if (!isOpen) return null;

  const sampleStyles = [
    {
      title: 'Silk Kurta & Festive Dress',
      category: 'clothes',
      keyword: 'kurta',
      url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&auto=format&fit=crop&q=80'
    },
    {
      title: 'Sport & Retro Sneakers',
      category: 'shoes',
      keyword: 'sneakers',
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80'
    },
    {
      title: 'Glow Skincare Serum Bottle',
      category: 'beauty',
      keyword: 'serum',
      url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80'
    },
    {
      title: 'AMOLED Smartwatch',
      category: 'accessories',
      keyword: 'smartwatch',
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setSelectedImage(url);
      runSimulatedAiVision(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handlePresetSelect = (item: typeof sampleStyles[0]) => {
    setSelectedImage(item.url);
    setIsAnalyzing(true);
    setDetectedCategory(null);
    setDetectedKeyword(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      setDetectedCategory(item.category);
      setDetectedKeyword(item.keyword);
    }, 700);
  };

  const runSimulatedAiVision = (fileName: string) => {
    setIsAnalyzing(true);
    setDetectedCategory(null);
    setDetectedKeyword(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      const lower = fileName.toLowerCase();
      if (lower.includes('shoe') || lower.includes('sneaker') || lower.includes('boot')) {
        setDetectedCategory('shoes');
        setDetectedKeyword('sneakers');
      } else if (lower.includes('watch') || lower.includes('ear') || lower.includes('ring')) {
        setDetectedCategory('accessories');
        setDetectedKeyword('smartwatch');
      } else if (lower.includes('serum') || lower.includes('cream') || lower.includes('perfume')) {
        setDetectedCategory('beauty');
        setDetectedKeyword('serum');
      } else {
        setDetectedCategory('clothes');
        setDetectedKeyword('shirt');
      }
    }, 900);
  };

  const applySearchResult = () => {
    if (detectedKeyword && detectedCategory) {
      onVisualSearch(detectedKeyword, detectedCategory);
      onClose();
    }
  };

  return (
    <div id="image-search-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div id="image-search-modal-card" className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 border border-slate-100">
        <button
          id="btn-close-image-search"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Vynora Visual Lens</h3>
            <p className="text-xs text-slate-500">Search with photos to find identical or similar products</p>
          </div>
        </div>

        {/* Upload Zone */}
        <div className="mt-4">
          <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-200 hover:border-rose-400 hover:bg-rose-50/40 rounded-xl cursor-pointer transition-colors p-4 text-center">
            <Upload className="w-8 h-8 text-rose-500 mb-2" />
            <span className="text-sm font-semibold text-slate-700">Drag & drop photo or click to upload</span>
            <span className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP from phone or desktop</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {/* Active Selected Image Preview */}
        {selectedImage && (
          <div className="mt-4 p-3 bg-slate-50 rounded-xl flex items-center gap-3 border border-slate-200">
            <img
              src={selectedImage}
              alt="Visual search target"
              className="w-16 h-16 object-cover rounded-lg border border-slate-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              {isAnalyzing ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-600">
                  <div className="w-3.5 h-3.5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                  <span>Scanning image features & textures...</span>
                </div>
              ) : (
                <div>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> Visual match detected!
                  </span>
                  <p className="text-sm font-bold text-slate-800 mt-1 truncate">
                    Category: <span className="capitalize">{detectedCategory}</span> • Pattern: {detectedKeyword}
                  </p>
                </div>
              )}
            </div>
            {!isAnalyzing && detectedKeyword && (
              <button
                id="btn-apply-image-search"
                onClick={applySearchResult}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors shrink-0"
              >
                View Matches
              </button>
            )}
          </div>
        )}

        {/* Demo Styles / Presets */}
        <div className="mt-5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
            <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>Try sample visual styles</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {sampleStyles.map(style => (
              <button
                key={style.title}
                id={`btn-sample-style-${style.category}`}
                onClick={() => handlePresetSelect(style)}
                className="group text-left border border-slate-200 hover:border-rose-400 rounded-xl p-1.5 hover:shadow-md transition-all bg-white"
              >
                <img
                  src={style.url}
                  alt={style.title}
                  className="w-full h-20 object-cover rounded-lg mb-1.5"
                />
                <p className="text-[11px] font-semibold text-slate-800 leading-tight truncate">
                  {style.title}
                </p>
                <span className="text-[10px] text-rose-600 font-medium capitalize">
                  {style.category}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
