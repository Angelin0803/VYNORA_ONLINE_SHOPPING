import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, PromoCode } from '../types';
import { PROMO_CODES } from '../data/products';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, selectedSize?: string, selectedColor?: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  discount: number;
  wholesaleSavings: number;
  finalTotal: number;
  isWholesaleMode: boolean;
  toggleWholesaleMode: () => void;
  appliedPromo: PromoCode | null;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  directCheckoutItem: CartItem | null;
  setDirectCheckoutItem: (item: CartItem | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vynora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isWholesaleMode, setIsWholesaleMode] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [directCheckoutItem, setDirectCheckoutItem] = useState<CartItem | null>(null);

  useEffect(() => {
    localStorage.setItem('vynora_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, selectedSize?: string, selectedColor?: string, quantity = 1) => {
    const size = selectedSize || (product.sizes && product.sizes.length ? product.sizes[0] : undefined);
    const color = selectedColor || (product.colors && product.colors.length ? product.colors[0].name : undefined);
    const cartItemId = `${product.id}-${size || 'nosize'}-${color || 'nocolor'}`;

    setItems(prev => {
      const existing = prev.find(item => item.id === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity
        }
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setItems(prev => prev.filter(i => i.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems(prev =>
      prev.map(item => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
    setDirectCheckoutItem(null);
  };

  const toggleWholesaleMode = () => {
    setIsWholesaleMode(prev => !prev);
  };

  const applyPromo = (codeStr: string) => {
    const code = PROMO_CODES.find(p => p.code.toLowerCase() === codeStr.trim().toLowerCase());
    if (!code) {
      return { success: false, message: 'Invalid promo code. Try VYNORA10 or FIRST50.' };
    }
    if (subtotal < code.minOrderValue) {
      return { success: false, message: `Minimum order value for ${code.code} is ₹${code.minOrderValue}` };
    }
    setAppliedPromo(code);
    return { success: true, message: `Coupon ${code.code} applied successfully!` };
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  // Calculations
  const activeItems = directCheckoutItem ? [directCheckoutItem] : items;

  const totalItemsCount = activeItems.reduce((acc, i) => acc + i.quantity, 0);

  // Normal retail subtotal
  const subtotal = activeItems.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);

  // Wholesale savings if enabled
  const wholesaleSavings = isWholesaleMode
    ? activeItems.reduce((acc, item) => {
        const diff = item.product.price - item.product.wholesalePrice;
        return acc + Math.max(0, diff) * item.quantity;
      }, 0)
    : 0;

  // Coupon discount
  let couponDiscount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent) {
      couponDiscount = Math.round((subtotal * appliedPromo.discountPercent) / 100);
    } else if (appliedPromo.flatDiscount) {
      couponDiscount = Math.min(subtotal, appliedPromo.flatDiscount);
    }
  }

  const discount = wholesaleSavings + couponDiscount;
  const finalTotal = Math.max(0, subtotal - discount);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItemsCount,
      subtotal,
      discount,
      wholesaleSavings,
      finalTotal,
      isWholesaleMode,
      toggleWholesaleMode,
      appliedPromo,
      applyPromo,
      removePromo,
      isCartOpen,
      setIsCartOpen,
      directCheckoutItem,
      setDirectCheckoutItem,
      isCheckoutOpen,
      setIsCheckoutOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
