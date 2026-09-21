export type ProductCategory = 'clothes' | 'shoes' | 'beauty' | 'accessories';
export type CategoryFilter = 'all' | ProductCategory;

export interface ProductVariant {
  id: string;
  name: string;
  inStock: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: ProductCategory;
  subCategory: string; // e.g., "Men's Western", "Women's Ethnic", "Sneakers", "Smartwatch"
  price: number; // in INR
  originalPrice: number;
  discountPercentage: number;
  wholesalePrice: number; // Meesho-style direct reseller/wholesale price
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  features: string[];
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  isAssured: boolean; // Amazon Prime / Flipkart Assured badge
  isTrending?: boolean;
  isBestSeller?: boolean;
  stock: number;
  tags: string[];
  specifications: Record<string, string>;
  pincodeDeliveryDays?: number;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  pincode: string;
  addressLine: string;
  city: string;
  state: string;
  isDefault: boolean;
  type: 'home' | 'work';
}

export type OrderStatus = 'placed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface TrackingStep {
  status: string;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  date: string;
  items: CartItem[];
  shippingAddress: Address;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
  paymentStatus: 'paid' | 'pending';
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  superCoinsEarned: number;
  superCoinsUsed: number;
  status: OrderStatus;
  estimatedDeliveryDate: string;
  courierName: string;
  trackingNumber: string;
  trackingSteps: TrackingStep[];
  cancelReason?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  superCoins: number;
  addresses: Address[];
  createdAt: string;
}

export interface PromoCode {
  code: string;
  discountPercent?: number;
  flatDiscount?: number;
  minOrderValue: number;
  description: string;
}
