import { Product, Review, Order, User, Address } from '../types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '../data/products';

// Local storage keys for resilient persistence
const STORAGE_KEYS = {
  USER: 'vynora_user',
  ORDERS: 'vynora_orders',
  REVIEWS: 'vynora_reviews',
  WISHLIST: 'vynora_wishlist',
  CART: 'vynora_cart'
};

export const apiClient = {
  // 1. PRODUCTS
  async getProducts(params?: {
    category?: string;
    subCategory?: string;
    q?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    trending?: boolean;
  }): Promise<{ total: number; products: Product[] }> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.category && params.category !== 'all') searchParams.append('category', params.category);
      if (params?.subCategory) searchParams.append('subCategory', params.subCategory);
      if (params?.q) searchParams.append('q', params.q);
      if (params?.minPrice) searchParams.append('minPrice', String(params.minPrice));
      if (params?.maxPrice) searchParams.append('maxPrice', String(params.maxPrice));
      if (params?.sort) searchParams.append('sort', params.sort);
      if (params?.trending) searchParams.append('trending', 'true');

      const res = await fetch(`/api/products?${searchParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return { total: data.total, products: data.products };
      }
    } catch {
      // fallback
    }

    // Local fallback
    let list = [...INITIAL_PRODUCTS];
    if (params?.category && params.category !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === params.category?.toLowerCase());
    }
    if (params?.subCategory) {
      list = list.filter(p => p.subCategory.toLowerCase() === params.subCategory?.toLowerCase());
    }
    if (params?.q) {
      const q = params.q.toLowerCase().trim();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (params?.minPrice) list = list.filter(p => p.price >= (params.minPrice || 0));
    if (params?.maxPrice) list = list.filter(p => p.price <= (params.maxPrice || Infinity));
    if (params?.trending) list = list.filter(p => p.isTrending || p.isBestSeller);

    if (params?.sort === 'price_low') list.sort((a, b) => a.price - b.price);
    else if (params?.sort === 'price_high') list.sort((a, b) => b.price - a.price);
    else if (params?.sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (params?.sort === 'discount') list.sort((a, b) => b.discountPercentage - a.discountPercentage);

    return { total: list.length, products: list };
  },

  async getProductById(id: string): Promise<{ product: Product; reviews: Review[] } | null> {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        return { product: data.product, reviews: data.reviews };
      }
    } catch {
      // fallback
    }

    const product = INITIAL_PRODUCTS.find(p => p.id === id);
    if (!product) return null;
    const storedReviews: Review[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
    const allReviews = [...storedReviews, ...INITIAL_REVIEWS];
    const reviews = allReviews.filter(r => r.productId === id);
    return { product, reviews };
  },

  // 2. REVIEWS
  async submitReview(data: {
    productId: string;
    userName: string;
    rating: number;
    title: string;
    comment: string;
  }): Promise<Review> {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const json = await res.json();
        return json.review;
      }
    } catch {
      // fallback
    }

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: data.productId,
      userName: data.userName,
      userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.userName)}`,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      date: 'Just now',
      verifiedPurchase: true,
      helpfulCount: 0
    };

    const storedReviews: Review[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
    storedReviews.unshift(newRev);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(storedReviews));
    return newRev;
  },

  // 3. ORDERS
  async getOrders(userId?: string): Promise<Order[]> {
    try {
      const res = await fetch('/api/orders', {
        headers: userId ? { 'x-user-id': userId } : {}
      });
      if (res.ok) {
        const data = await res.json();
        if (data.orders && data.orders.length) return data.orders;
      }
    } catch {
      // fallback
    }

    const localOrders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    return localOrders;
  },

  async createOrder(orderPayload: any, userId?: string): Promise<Order> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(userId ? { 'x-user-id': userId } : {})
        },
        body: JSON.stringify(orderPayload)
      });
      if (res.ok) {
        const data = await res.json();
        const savedOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
        savedOrders.unshift(data.order);
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(savedOrders));
        return data.order;
      }
    } catch {
      // fallback
    }

    const orderNum = `VYN-${Date.now().toString().slice(-6)}`;
    const trackingNum = `VYEX${Math.floor(10000000 + Math.random() * 90000000)}IN`;
    const deliveryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    const formattedDelivery = `${deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} by 8:00 PM`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      userId: userId || 'usr-default',
      date: 'Just now',
      items: orderPayload.items,
      shippingAddress: orderPayload.shippingAddress,
      paymentMethod: orderPayload.paymentMethod || 'upi',
      paymentStatus: orderPayload.paymentMethod === 'cod' ? 'pending' : 'paid',
      totalAmount: orderPayload.totalAmount,
      discountAmount: orderPayload.discountAmount || 0,
      shippingFee: 0,
      superCoinsEarned: Math.floor(orderPayload.totalAmount * 0.05),
      superCoinsUsed: orderPayload.superCoinsUsed || 0,
      status: 'placed',
      estimatedDeliveryDate: formattedDelivery,
      courierName: 'Vynora Express Premium Air',
      trackingNumber: trackingNum,
      trackingSteps: [
        {
          status: 'placed',
          title: 'Order Confirmed',
          description: 'Payment verified and seller alerted.',
          timestamp: 'Just now',
          completed: true,
          current: true
        },
        {
          status: 'packed',
          title: 'Warehouse Packaging & QA',
          description: 'Inspected for authentic tags and quality.',
          timestamp: 'Expected within 4 hours',
          completed: false,
          current: false
        },
        {
          status: 'shipped',
          title: 'Dispatched in Transit',
          description: `Tracking ID: ${trackingNum}`,
          timestamp: 'Expected by evening',
          completed: false,
          current: false
        },
        {
          status: 'out_for_delivery',
          title: 'Out for Express Delivery',
          description: 'Courier agent will verify OTP at delivery.',
          timestamp: formattedDelivery.split('by')[0],
          completed: false,
          current: false
        },
        {
          status: 'delivered',
          title: 'Delivered',
          description: 'Delivery confirmed.',
          timestamp: formattedDelivery,
          completed: false,
          current: false
        }
      ]
    };

    const savedOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    savedOrders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(savedOrders));
    return newOrder;
  },

  async cancelOrder(orderId: string, reason?: string): Promise<Order | null> {
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      if (res.ok) {
        const data = await res.json();
        return data.order;
      }
    } catch {
      // fallback
    }

    const savedOrders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const order = savedOrders.find(o => o.id === orderId);
    if (order) {
      order.status = 'cancelled';
      order.cancelReason = reason || 'Customer requested cancellation';
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(savedOrders));
      return order;
    }
    return null;
  },

  // 4. AUTH
  async login(email: string): Promise<User> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
        return data.user;
      }
    } catch {
      // fallback
    }

    const fallbackUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0] || 'Vynora Shopper',
      email,
      phone: '+91 98765 43210',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      superCoins: 250,
      createdAt: new Date().toISOString(),
      addresses: [
        {
          id: 'addr-local-1',
          fullName: email.split('@')[0] || 'Vynora Shopper',
          phone: '+91 98765 43210',
          pincode: '641001',
          addressLine: '12, Gandhipuram Main Rd',
          city: 'Coimbatore',
          state: 'Tamil Nadu',
          isDefault: true,
          type: 'home'
        }
      ]
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(fallbackUser));
    return fallbackUser;
  },

  async register(name: string, email: string, phone: string): Promise<User> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
        return data.user;
      }
    } catch {
      // fallback
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone: phone || '+91 98765 00000',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      superCoins: 100,
      createdAt: new Date().toISOString(),
      addresses: [
        {
          id: `addr-${Date.now()}`,
          fullName: name,
          phone: phone || '+91 98765 00000',
          pincode: '560001',
          addressLine: 'House No 104, Residency Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          isDefault: true,
          type: 'home'
        }
      ]
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    return newUser;
  },

  async checkPincode(pincode: string) {
    try {
      const res = await fetch(`/api/pincode/${pincode}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const days = 2 + (Number(pincode.slice(-1)) % 3);
    const date = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const formatted = date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
    return {
      success: true,
      pincode,
      deliveryDate: `${formatted} by 8:00 PM`,
      isCodAvailable: true,
      isExpressAvailable: true,
      hubCity: 'Vynora Regional Hub'
    };
  }
};
