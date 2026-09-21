import express, { Request, Response } from 'express';
import { generateProducts, INITIAL_REVIEWS } from '../data/products.ts';
import { Product, Review, Order, User, Address } from '../types/index.ts';

const apiRouter = express.Router();
apiRouter.use(express.json());

// In-Memory Database Store (with initial realistic seed data)
const db = {
  products: generateProducts(),
  reviews: [...INITIAL_REVIEWS],
  users: [
    {
      id: 'usr-vynora-1',
      name: 'Angelin Anand',
      email: 'angelin@vynora.in',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      superCoins: 450,
      createdAt: '2026-01-15T10:00:00.000Z',
      addresses: [
        {
          id: 'addr-1',
          fullName: 'Angelin Anand',
          phone: '+91 98765 43210',
          pincode: '641001',
          addressLine: '42, Brookefields Residency, Avinashi Road',
          city: 'Coimbatore',
          state: 'Tamil Nadu',
          isDefault: true,
          type: 'home' as const
        },
        {
          id: 'addr-2',
          fullName: 'Angelin (Office)',
          phone: '+91 98765 43210',
          pincode: '560100',
          addressLine: 'Tower B, Tech Park, Electronic City',
          city: 'Bengaluru',
          state: 'Karnataka',
          isDefault: false,
          type: 'work' as const
        }
      ]
    }
  ],
  orders: [] as Order[]
};

// Seed an initial realistic order with live tracking
const demoProduct = db.products[0];
const demoProduct2 = db.products[55]; // shoe

db.orders.push({
  id: 'ord-vynora-98210',
  orderNumber: 'VYN-2026-98210',
  userId: 'usr-vynora-1',
  date: 'Yesterday at 04:30 PM',
  items: [
    {
      id: 'cart-demo-1',
      product: demoProduct,
      selectedSize: 'M',
      selectedColor: 'Midnight Black',
      quantity: 1
    },
    {
      id: 'cart-demo-2',
      product: demoProduct2,
      selectedSize: 'UK 8',
      selectedColor: 'Pure White',
      quantity: 1
    }
  ],
  shippingAddress: db.users[0].addresses[0],
  paymentMethod: 'upi',
  paymentStatus: 'paid',
  totalAmount: demoProduct.price + demoProduct2.price,
  discountAmount: 200,
  shippingFee: 0,
  superCoinsEarned: 85,
  superCoinsUsed: 50,
  status: 'shipped',
  estimatedDeliveryDate: 'Tomorrow by 8:00 PM',
  courierName: 'Vynora Express Logistics (Air)',
  trackingNumber: 'VYEX9482710IN',
  trackingSteps: [
    {
      status: 'placed',
      title: 'Order Verified & Approved',
      description: 'Order received and digital payment confirmed via UPI.',
      timestamp: 'Yesterday, 04:30 PM',
      completed: true,
      current: false
    },
    {
      status: 'packed',
      title: 'Quality Inspected & Packed',
      description: 'Items double-bubble wrapped and packaged at Bengaluru Fulfillment Center.',
      timestamp: 'Yesterday, 08:15 PM',
      completed: true,
      current: false
    },
    {
      status: 'shipped',
      title: 'Dispatched in Transit',
      description: 'Departed Hub: Sorting Facility Coimbatore Air Hub. In-transit to local delivery hub.',
      timestamp: 'Today, 06:40 AM',
      completed: true,
      current: true
    },
    {
      status: 'out_for_delivery',
      title: 'Out for Express Delivery',
      description: 'Assigned to Delivery Partner Suresh K. (+91 94432 10987). OTP will be required.',
      timestamp: 'Expected Tomorrow, 09:00 AM',
      completed: false,
      current: false
    },
    {
      status: 'delivered',
      title: 'Delivered to Doorstep',
      description: 'Package handed over safely with verified contactless handover.',
      timestamp: 'Expected Tomorrow by 08:00 PM',
      completed: false,
      current: false
    }
  ]
});

// -------------------------------------------------------------
// 1. PRODUCTS API
// -------------------------------------------------------------

// GET /api/products - Filter by category, query, price, sort
apiRouter.get('/products', (req: Request, res: Response) => {
  let list = [...db.products];
  const { category, subCategory, q, minPrice, maxPrice, sort, trending } = req.query;

  if (category && typeof category === 'string' && category !== 'all') {
    list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (subCategory && typeof subCategory === 'string') {
    list = list.filter(p => p.subCategory.toLowerCase() === subCategory.toLowerCase());
  }

  if (q && typeof q === 'string') {
    const query = q.toLowerCase().trim();
    list = list.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.subCategory.toLowerCase().includes(query) ||
      p.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  if (minPrice) {
    list = list.filter(p => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    list = list.filter(p => p.price <= Number(maxPrice));
  }

  if (trending === 'true') {
    list = list.filter(p => p.isTrending || p.isBestSeller);
  }

  if (sort === 'price_low') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_high') {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'discount') {
    list.sort((a, b) => b.discountPercentage - a.discountPercentage);
  }

  res.json({
    success: true,
    total: list.length,
    products: list
  });
});

// GET /api/products/:id - Single product details
apiRouter.get('/products/:id', (req: Request, res: Response) => {
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const reviews = db.reviews.filter(r => r.productId === product.id);
  res.json({
    success: true,
    product,
    reviews
  });
});

// -------------------------------------------------------------
// 2. REVIEWS & RATINGS API
// -------------------------------------------------------------

// GET /api/reviews/:productId
apiRouter.get('/reviews/:productId', (req: Request, res: Response) => {
  const reviews = db.reviews.filter(r => r.productId === req.params.productId);
  res.json({ success: true, reviews });
});

// POST /api/reviews - Add customer review
apiRouter.post('/reviews', (req: Request, res: Response) => {
  const { productId, userName, rating, title, comment } = req.body;
  if (!productId || !userName || !rating || !title || !comment) {
    return res.status(400).json({ success: false, message: 'Missing required review fields' });
  }

  const newReview: Review = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    productId,
    userName,
    userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`,
    rating: Number(rating),
    title,
    comment,
    date: 'Just now',
    verifiedPurchase: true,
    helpfulCount: 0
  };

  db.reviews.unshift(newReview);

  // Update product average rating & review count
  const product = db.products.find(p => p.id === productId);
  if (product) {
    const productReviews = db.reviews.filter(r => r.productId === productId);
    const avg = productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length;
    product.rating = Number(avg.toFixed(1));
    product.reviewCount += 1;
  }

  res.status(201).json({ success: true, review: newReview, message: 'Review submitted successfully!' });
});

// POST /api/reviews/:id/helpful - Upvote review
apiRouter.post('/reviews/:id/helpful', (req: Request, res: Response) => {
  const review = db.reviews.find(r => r.id === req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }
  review.helpfulCount += 1;
  res.json({ success: true, helpfulCount: review.helpfulCount });
});

// -------------------------------------------------------------
// 3. AUTH & USER PROFILE API
// -------------------------------------------------------------

// POST /api/auth/register
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required' });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists' });
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    name,
    email,
    phone: phone || '+91 98765 00000',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    superCoins: 100, // Welcome bonus coins!
    createdAt: new Date().toISOString(),
    addresses: []
  };

  db.users.push(newUser);
  res.status(201).json({ success: true, user: newUser, message: 'Account registered successfully!' });
});

// POST /api/auth/login
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  let user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() || u.phone === email);
  if (!user) {
    // For effortless review and testing, auto-create or log in with guest profile
    user = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0] || 'Vynora Shopper',
      email,
      phone: '+91 98765 12345',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      superCoins: 150,
      createdAt: new Date().toISOString(),
      addresses: [
        {
          id: 'addr-default',
          fullName: email.split('@')[0] || 'Vynora Shopper',
          phone: '+91 98765 12345',
          pincode: '560001',
          addressLine: 'Flat 402, Green Avenue, MG Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          isDefault: true,
          type: 'home'
        }
      ]
    };
    db.users.push(user);
  }

  res.json({ success: true, user, message: 'Logged in successfully' });
});

// GET /api/auth/me - Current user details
apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  const user = db.users.find(u => u.id === userId) || db.users[0];
  res.json({ success: true, user });
});

// POST /api/user/address - Add new address
apiRouter.post('/user/address', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  const user = db.users.find(u => u.id === userId) || db.users[0];
  const { fullName, phone, pincode, addressLine, city, state, type } = req.body;

  if (!fullName || !pincode || !addressLine) {
    return res.status(400).json({ success: false, message: 'Required address details missing' });
  }

  const newAddress: Address = {
    id: `addr-${Date.now()}`,
    fullName,
    phone: phone || user.phone,
    pincode,
    addressLine,
    city: city || 'Bengaluru',
    state: state || 'Karnataka',
    isDefault: user.addresses.length === 0,
    type: type || 'home'
  };

  user.addresses.push(newAddress);
  res.status(201).json({ success: true, address: newAddress, addresses: user.addresses });
});

// -------------------------------------------------------------
// 4. ORDERS & EXPRESS DELIVERY TRACKING API
// -------------------------------------------------------------

// GET /api/orders - Get user orders
apiRouter.get('/orders', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string || db.users[0].id;
  const userOrders = db.orders.filter(o => o.userId === userId);
  res.json({ success: true, orders: userOrders.length ? userOrders : db.orders });
});

// GET /api/orders/:id - Track order by ID
apiRouter.get('/orders/:id', (req: Request, res: Response) => {
  const order = db.orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, order });
});

// POST /api/orders - Create new order (Buy Now or Cart Checkout)
apiRouter.post('/orders', (req: Request, res: Response) => {
  const {
    items,
    shippingAddress,
    paymentMethod,
    totalAmount,
    discountAmount,
    superCoinsUsed
  } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
  }

  const userId = req.headers['x-user-id'] as string || db.users[0].id;
  const user = db.users.find(u => u.id === userId) || db.users[0];

  const now = new Date();
  const deliveryDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const formattedDelivery = `${deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} by 8:00 PM`;

  const orderNum = `VYN-${Date.now().toString().slice(-6)}`;
  const trackingNum = `VYEX${Math.floor(10000000 + Math.random() * 90000000)}IN`;

  const superCoinsEarned = Math.floor(totalAmount * 0.05); // 5% cashback in SuperCoins

  // Deduct used supercoins & credit new
  if (superCoinsUsed && user) {
    user.superCoins = Math.max(0, user.superCoins - superCoinsUsed);
  }
  if (user) {
    user.superCoins += superCoinsEarned;
  }

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: orderNum,
    userId,
    date: 'Just now',
    items,
    shippingAddress: shippingAddress || (user ? user.addresses[0] : null),
    paymentMethod: paymentMethod || 'upi',
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
    totalAmount,
    discountAmount: discountAmount || 0,
    shippingFee: 0,
    superCoinsEarned,
    superCoinsUsed: superCoinsUsed || 0,
    status: 'placed',
    estimatedDeliveryDate: formattedDelivery,
    courierName: 'Vynora Express Premium Air',
    trackingNumber: trackingNum,
    trackingSteps: [
      {
        status: 'placed',
        title: 'Order Confirmed',
        description: 'Seller has received your order and payment authorization.',
        timestamp: 'Just now',
        completed: true,
        current: true
      },
      {
        status: 'packed',
        title: 'Packaging & Barcode Verification',
        description: 'Fulfillment centre assigned. Ready for safe box packing.',
        timestamp: 'Expected within 4 hours',
        completed: false,
        current: false
      },
      {
        status: 'shipped',
        title: 'Dispatched via Vynora Logistics',
        description: 'Dispatched with Tracking ID: ' + trackingNum,
        timestamp: 'Expected by tonight',
        completed: false,
        current: false
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Vynora delivery executive will contact before arrival.',
        timestamp: formattedDelivery.split('by')[0],
        completed: false,
        current: false
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Delivered safely with verified digital proof.',
        timestamp: formattedDelivery,
        completed: false,
        current: false
      }
    ]
  };

  db.orders.unshift(newOrder);

  res.status(201).json({
    success: true,
    order: newOrder,
    superCoinsEarned,
    message: 'Order placed successfully!'
  });
});

// POST /api/orders/:id/cancel - Cancel order
apiRouter.post('/orders/:id/cancel', (req: Request, res: Response) => {
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  if (order.status === 'delivered') {
    return res.status(400).json({ success: false, message: 'Delivered orders cannot be cancelled. Use 7-day return instead.' });
  }

  order.status = 'cancelled';
  order.cancelReason = req.body.reason || 'Customer requested cancellation';
  order.trackingSteps.push({
    status: 'cancelled',
    title: 'Order Cancelled',
    description: `Order cancelled. Refund initiated to original payment source.`,
    timestamp: 'Just now',
    completed: true,
    current: true
  });

  res.json({ success: true, order, message: 'Order cancelled successfully. Refund initiated.' });
});

// -------------------------------------------------------------
// 5. PINCODE DELIVERY ESTIMATOR API
// -------------------------------------------------------------
apiRouter.get('/pincode/:pincode', (req: Request, res: Response) => {
  const pin = req.params.pincode;
  const isValid = /^[1-9][0-9]{5}$/.test(pin);
  if (!isValid) {
    return res.status(400).json({ success: false, message: 'Please enter a valid 6-digit Indian PIN code' });
  }

  const days = 2 + (Number(pin.slice(-1)) % 3);
  const date = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  const formatted = date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

  res.json({
    success: true,
    pincode: pin,
    deliveryDate: `${formatted} by 8:00 PM`,
    isCodAvailable: true,
    isExpressAvailable: true,
    hubCity: Number(pin[0]) === 6 ? 'Chennai/Coimbatore' : Number(pin[0]) === 5 ? 'Bengaluru' : Number(pin[0]) === 4 ? 'Mumbai' : 'Delhi NCR'
  });
});

export default apiRouter;
