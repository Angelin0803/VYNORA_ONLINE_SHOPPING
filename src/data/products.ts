import { Product, Review } from '../types';

// Curated high-res Unsplash image collections tailored to categories
const CLOTHES_IMAGES = [
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
];

const SHOES_IMAGES = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&auto=format&fit=crop&q=80',
];

const BEAUTY_IMAGES = [
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1608248597359-0d3674683072?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512290900672-1f4a9b6c08bc?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80',
];

const ACCESSORIES_IMAGES = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&auto=format&fit=crop&q=80',
];

// Clothes sub-genres covering Men, Women, Kids, Elderly & Teens
const CLOTHES_TEMPLATES = [
  { subCategory: "Men's Ethnic", titlePrefix: "Royal Silk Kurta Pajama Set", brand: "Manyavar Elegance", sizes: ["S", "M", "L", "XL", "XXL"], price: 1899, orig: 3999 },
  { subCategory: "Men's Western", titlePrefix: "Slim Fit Breathable Cotton Casual Shirt", brand: "Roadster Denim Co.", sizes: ["38", "40", "42", "44"], price: 799, orig: 1999 },
  { subCategory: "Men's Casuals", titlePrefix: "Oversized Streetwear Graphic Drop Shoulder Tee", brand: "Vynora Urban", sizes: ["S", "M", "L", "XL"], price: 549, orig: 1299 },
  { subCategory: "Men's Formal", titlePrefix: "Wrinkle-Free Poly-Cotton Dress Trousers", brand: "Van Heusen Luxe", sizes: ["30", "32", "34", "36", "38"], price: 1249, orig: 2499 },
  { subCategory: "Men's Winter", titlePrefix: "Quilted Thermal Windproof Bomber Jacket", brand: "Wildcraft Storm", sizes: ["M", "L", "XL"], price: 2199, orig: 4599 },
  
  { subCategory: "Women's Ethnic", titlePrefix: "Banarasi Art Silk Zari Woven Saree with Blouse", brand: "Kanjivaram Heritage", sizes: ["Free Size"], price: 1499, orig: 4999 },
  { subCategory: "Women's Ethnic", titlePrefix: "Embroidered Anarkali Kurti Pant with Dupatta Set", brand: "Biba Royale", sizes: ["XS", "S", "M", "L", "XL"], price: 1899, orig: 3999 },
  { subCategory: "Women's Western", titlePrefix: "Floral Print Tiered A-Line Midi Dress", brand: "Tokyo Talkies", sizes: ["XS", "S", "M", "L"], price: 899, orig: 2299 },
  { subCategory: "Women's Western", titlePrefix: "High-Waist Stretchable Denim Mom Jeans", brand: "Levi's Classic", sizes: ["26", "28", "30", "32"], price: 1699, orig: 3299 },
  { subCategory: "Women's Active", titlePrefix: "Seamless High-Waist Workout Leggings & Crop Top", brand: "HRX Activewear", sizes: ["S", "M", "L"], price: 1199, orig: 2599 },
  { subCategory: "Women's Casuals", titlePrefix: "Soft Knit Pastel Ribbed Cardigan", brand: "Vynora Chic", sizes: ["Free Size", "S", "M"], price: 949, orig: 1999 },

  { subCategory: "Kids Wear (Boys)", titlePrefix: "Dino Print 100% Organic Cotton T-Shirt & Shorts", brand: "Hopscotch Kids", sizes: ["2-3Y", "3-4Y", "5-6Y", "7-8Y"], price: 499, orig: 1199 },
  { subCategory: "Kids Wear (Girls)", titlePrefix: "Princess Layered Tulle Party Frock Dress", brand: "Mini Klub", sizes: ["1-2Y", "3-4Y", "5-6Y", "7-8Y"], price: 799, orig: 1799 },
  { subCategory: "Kids Ethnic", titlePrefix: "Bandhani Print Boys Kurta Dhoti Festive Set", brand: "FirstCry Festive", sizes: ["2-3Y", "4-5Y", "6-7Y"], price: 699, orig: 1599 },
  { subCategory: "Infant & Toddler", titlePrefix: "Bamboo Fabric 3-Pack Unisex Sleepsuits", brand: "Mothercare Snug", sizes: ["0-3M", "3-6M", "6-12M"], price: 899, orig: 1899 },
  
  { subCategory: "Elderly Comfort Wear", titlePrefix: "Pure Mulmul Cotton Breathable Comfort Kurta", brand: "Khadi Gramodyog", sizes: ["M", "L", "XL", "XXL", "3XL"], price: 649, orig: 1499 },
  { subCategory: "Elderly Loungewear", titlePrefix: "Elastic Waistband Soft Flannel Pajama Set", brand: "Marks & Spencer Sleep", sizes: ["L", "XL", "XXL"], price: 1149, orig: 2299 },
  { subCategory: "Teens Trend", titlePrefix: "Y2K Baggy Cargo Pants with Utility Chains", brand: "Urban Monkey", sizes: ["28", "30", "32", "34"], price: 1399, orig: 2899 }
];

// Shoes sub-genres
const SHOES_TEMPLATES = [
  { subCategory: "Men's Sneakers", titlePrefix: "Air Cushioned Retro Chunky Low-Top Sneakers", brand: "Nike Vapor Air", sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"], price: 2499, orig: 5999 },
  { subCategory: "Running Shoes", titlePrefix: "Ultralight Foam High-Rebound Marathon Runners", brand: "Puma Nitro Pro", sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"], price: 1999, orig: 4499 },
  { subCategory: "Formal Oxfords", titlePrefix: "Handcrafted Italian Leather Derby Formal Shoes", brand: "Bata Red Label", sizes: ["UK 7", "UK 8", "UK 9", "UK 10"], price: 2199, orig: 4999 },
  { subCategory: "Casual Loafers", titlePrefix: "Slip-On Suede Tassel Driving Moccasins", brand: "Woodland Heritage", sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"], price: 1699, orig: 3599 },
  { subCategory: "Ethnic Juttis", titlePrefix: "Embroidered Velvet Sherwani Mojari Jutti", brand: "Metro Royal", sizes: ["UK 7", "UK 8", "UK 9", "UK 10"], price: 999, orig: 2499 },
  { subCategory: "Women's Heels", titlePrefix: "Stiletto Pointed-Toe Ankle Strap Party Pumps", brand: "Catwalk Glam", sizes: ["UK 4", "UK 5", "UK 6", "UK 7"], price: 1599, orig: 3499 },
  { subCategory: "Women's Flats", titlePrefix: "Orthopedic Memory Foam Ballet Daily Flats", brand: "Doctor Extra Soft", sizes: ["UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], price: 699, orig: 1599 },
  { subCategory: "Sports Sandals", titlePrefix: "Waterproof Grip Trekking & Hiking Sandals", brand: "Campus Explorer", sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"], price: 849, orig: 1899 },
  { subCategory: "Kids Sports Shoes", titlePrefix: "LED Light-Up Slip-Proof Kids Athletic Shoes", brand: "Liberty Force", sizes: ["UK 1", "UK 2", "UK 3", "UK 4", "UK 5"], price: 799, orig: 1699 },
  { subCategory: "Elderly Walking Shoes", titlePrefix: "Air-Mesh Slip-On Diabetic Arch Support Walkers", brand: "Skechers GOwalk", sizes: ["UK 6", "UK 7", "UK 8", "UK 9"], price: 2299, orig: 4999 }
];

// Beauty sub-genres
const BEAUTY_TEMPLATES = [
  { subCategory: "Skincare Serums", titlePrefix: "10% Niacinamide + Zinc Dark Spot Corrector Serum", brand: "The Derma Co", sizes: ["30ml", "50ml"], price: 449, orig: 699 },
  { subCategory: "Face Sunscreen", titlePrefix: "Ultra-Light Matte Sunscreen Gel SPF 50+ PA++++", brand: "Aqualogica Glow", sizes: ["50g", "100g"], price: 399, orig: 649 },
  { subCategory: "Lip Care & Makeup", titlePrefix: "Velvet Matte Liquid Long-Lasting Weightless Lipstick", brand: "Maybelline New York", sizes: ["Standard 4.2ml"], price: 349, orig: 599 },
  { subCategory: "Ayurvedic Hair Oil", titlePrefix: "Bhringraj & Red Onion Deep Root Hair Fall Defense Oil", brand: "Mamaearth Pure", sizes: ["150ml", "250ml"], price: 379, orig: 599 },
  { subCategory: "Luxury Perfumes", titlePrefix: "French Eau De Parfum Artisan Amber & Musk Scent", brand: "Bella Vita Organic", sizes: ["100ml"], price: 699, orig: 1499 },
  { subCategory: "Face Washes", titlePrefix: "Gentle Hydrating Cleanser with Hyaluronic Acid", brand: "Cetaphil Gentle", sizes: ["125ml", "250ml"], price: 389, orig: 549 },
  { subCategory: "Men's Beard Care", titlePrefix: "Cedarwood Beard Growth Oil & Conditioning Balm Kit", brand: "Beardo Godfather", sizes: ["50ml + 50g"], price: 499, orig: 999 },
  { subCategory: "Eyes & Mascara", titlePrefix: "Colossal Waterproof Volume Express Lash Mascara", brand: "Lakmé Absolute", sizes: ["9ml"], price: 299, orig: 499 },
  { subCategory: "Body Lotions", titlePrefix: "Deep Nourish Cocoa Butter Body Lotion with Vitamin E", brand: "Nivea Nourishing", sizes: ["400ml"], price: 329, orig: 499 },
  { subCategory: "Bath & Spa", titlePrefix: "Himalayan Pink Rock Bath Salts with Lavender Aromatherapy", brand: "Kama Ayurveda", sizes: ["300g"], price: 599, orig: 1199 }
];

// Smart Accessories sub-genres
const ACCESSORIES_TEMPLATES = [
  { subCategory: "Smartwatches", titlePrefix: "1.96-inch AMOLED Display Bluetooth Calling Smartwatch", brand: "boAt Wave Pro", sizes: ["44mm Dial"], price: 1899, orig: 4999 },
  { subCategory: "TWS Earbuds", titlePrefix: "Active Noise Cancellation 32dB Low Latency Gaming Earbuds", brand: "Noise Buds VS", sizes: ["Universal"], price: 1299, orig: 3499 },
  { subCategory: "Over-Ear Headphones", titlePrefix: "Wireless Hi-Res Bass Headphones with 60Hr Playtime", brand: "Sony WH-Series", sizes: ["Adjustable"], price: 3499, orig: 7999 },
  { subCategory: "Fast Chargers", titlePrefix: "65W Dual Port GaN Fast Charger for Laptops & Phones", brand: "Portronics Power", sizes: ["Type-C + USB-A"], price: 999, orig: 2499 },
  { subCategory: "Power Banks", titlePrefix: "20000mAh 22.5W Fast Charging Metal Body Powerbank", brand: "Mi Power Master", sizes: ["Compact 20000mAh"], price: 1499, orig: 2999 },
  { subCategory: "Smart Rings", titlePrefix: "Titanium Sleep & Heart Rate Monitoring Smart Health Ring", brand: "Ultrahuman Air", sizes: ["Size 7", "Size 8", "Size 9", "Size 10"], price: 4999, orig: 9999 },
  { subCategory: "Car Mounts & Chargers", titlePrefix: "Automatic 15W Qi Magnetic Wireless Car Charger & Mount", brand: "Ambrane Mount", sizes: ["Universal Air Vent"], price: 849, orig: 1999 },
  { subCategory: "Stylus & Stands", titlePrefix: "Ergonomic 360-degree Rotating Aluminum Laptop Riser", brand: "Dyazo Metal", sizes: ["Fits 10-17 inch"], price: 749, orig: 1899 },
  { subCategory: "Smart Trackers", titlePrefix: "Bluetooth Anti-Lost Smart Tag with Apple/Android Network", brand: "Tile Mate", sizes: ["Pack of 1", "Pack of 2"], price: 1199, orig: 2499 },
  { subCategory: "Cables & Hubs", titlePrefix: "7-in-1 4K HDMI USB-C Multiport Docking Station", brand: "Anker Hub Pro", sizes: ["Thunderbolt 3/4 Compatible"], price: 1799, orig: 3999 }
];

// Color palette options
const COLOR_PALETTES = [
  [ { name: 'Midnight Black', hex: '#111827' }, { name: 'Navy Blue', hex: '#1e3a8a' }, { name: 'Olive Green', hex: '#3f6212' } ],
  [ { name: 'Pure White', hex: '#f8fafc' }, { name: 'Pastel Pink', hex: '#f472b6' }, { name: 'Lavender', hex: '#c084fc' } ],
  [ { name: 'Charcoal Grey', hex: '#374151' }, { name: 'Burgundy Red', hex: '#881337' }, { name: 'Royal Gold', hex: '#ca8a04' } ],
  [ { name: 'Space Titanium', hex: '#4b5563' }, { name: 'Rose Gold', hex: '#fb7185' }, { name: 'Matte Black', hex: '#09090b' } ],
  [ { name: 'Teal Green', hex: '#0f766e' }, { name: 'Sunset Amber', hex: '#d97706' }, { name: 'Cream Beige', hex: '#fef3c7' } ]
];

// Function to generate at least 52 products per category (Total: 208+ products!)
export function generateProducts(): Product[] {
  const products: Product[] = [];

  const categoriesConfig: { category: 'clothes' | 'shoes' | 'beauty' | 'accessories'; templates: any[]; images: string[] }[] = [
    { category: 'clothes', templates: CLOTHES_TEMPLATES, images: CLOTHES_IMAGES },
    { category: 'shoes', templates: SHOES_TEMPLATES, images: SHOES_IMAGES },
    { category: 'beauty', templates: BEAUTY_TEMPLATES, images: BEAUTY_IMAGES },
    { category: 'accessories', templates: ACCESSORIES_TEMPLATES, images: ACCESSORIES_IMAGES }
  ];

  categoriesConfig.forEach(({ category, templates, images }) => {
    // We generate 52 products per category
    for (let i = 1; i <= 52; i++) {
      const template = templates[(i - 1) % templates.length];
      const img1 = images[(i - 1) % images.length];
      const img2 = images[i % images.length];
      const img3 = images[(i + 2) % images.length];

      // Subtle price variances
      const priceModifier = 1 + ((i % 7) - 3) * 0.05;
      const price = Math.round((template.price * priceModifier) / 10) * 10;
      const originalPrice = Math.round((template.orig * priceModifier) / 10) * 10;
      const discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
      // Meesho-style wholesale price (approx 12-18% further discount for resellers/bulk)
      const wholesalePrice = Math.round(price * 0.84);

      const rating = Number((3.9 + ((i * 17) % 11) / 10).toFixed(1)); // between 3.9 and 4.9
      const reviewCount = 35 + ((i * 83) % 2450);

      const colors = COLOR_PALETTES[i % COLOR_PALETTES.length];

      const tags = [
        category,
        template.subCategory.toLowerCase(),
        template.brand.toLowerCase(),
        'vynora top pick',
        i % 2 === 0 ? 'trending' : 'best seller',
        'free delivery',
        'cash on delivery'
      ];

      const specifications: Record<string, string> = {
        Brand: template.brand,
        Category: template.subCategory,
        Material: category === 'clothes' ? '100% Combed Premium Cotton' : category === 'shoes' ? 'Breathable Mesh & Lightweight EVA' : category === 'beauty' ? 'Dermatologically Tested Natural Extracts' : 'Aerospace Grade Aluminum & Silicon',
        Warranty: category === 'accessories' ? '1 Year Manufacturer Replacement Warranty' : '7 Days Return / Exchange Guarantee',
        'Country of Origin': 'India',
        'Package Contains': category === 'clothes' ? '1 Main Garment, 1 Brand Tag' : category === 'shoes' ? '1 Pair of Shoes, Extra Laces' : category === 'beauty' ? '1 Product Bottle/Dispenser, User Manual' : '1 Device, Fast Charging Cable, Warranty Card'
      };

      products.push({
        id: `vynora-${category}-${String(i).padStart(3, '0')}`,
        title: `${template.titlePrefix} - Edition ${Math.floor(i / 10) + 1} (${template.subCategory})`,
        brand: template.brand,
        category,
        subCategory: template.subCategory,
        price,
        originalPrice,
        discountPercentage,
        wholesalePrice,
        rating,
        reviewCount,
        images: [img1, img2, img3],
        description: `Experience supreme comfort and authentic style with the ${template.titlePrefix}. Engineered with top-grade materials, precision stitching, and premium finishing. Loved by over ${reviewCount}+ happy customers on Vynora across India.`,
        features: [
          'Assured Vynora Quality Check & Direct Manufacturer Sourcing',
          'Cash on Delivery & Instant UPI Cashback Eligible',
          '7 Days Hassle-Free Returns & Exchange Policy',
          category === 'accessories' ? 'IP68 Water Resistance & Fast Charging Support' : 'All-day breathable comfort & long-lasting durability'
        ],
        sizes: template.sizes,
        colors,
        isAssured: i % 3 !== 0,
        isTrending: i % 4 === 0,
        isBestSeller: i % 5 === 0,
        stock: 25 + (i * 7) % 80,
        tags,
        specifications,
        pincodeDeliveryDays: 2 + (i % 3)
      });
    }
  });

  return products;
}

// Initial Sample Reviews for Products
export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'vynora-clothes-001',
    userName: 'Aarav Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Outstanding fabric quality! Perfect fit for festive occasions.',
    comment: 'Ordered this for Diwali puja. The silk zari work is genuinely rich and doesn’t feel itchy at all. Delivery arrived in 2 days in Bangalore with beautiful box packaging. Truly impressed with Vynora!',
    date: '2 days ago',
    verifiedPurchase: true,
    helpfulCount: 24
  },
  {
    id: 'rev-2',
    productId: 'vynora-clothes-001',
    userName: 'Priya Iyer',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Best ethnic kurta under ₹2000 in India.',
    comment: 'My brother loved it. Stitching is solid, color is exactly as pictured. Even better than what we saw on other retail apps.',
    date: '1 week ago',
    verifiedPurchase: true,
    helpfulCount: 16
  },
  {
    id: 'rev-3',
    productId: 'vynora-shoes-001',
    userName: 'Vikram Sundaram',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Cloud-like cushion for daily gym & jogging.',
    comment: 'Sole is super responsive. Very stylish retro chunky look with nice grip. Fits true to size (I wear UK 9). Vynora’s express tracking was spot on!',
    date: '3 days ago',
    verifiedPurchase: true,
    helpfulCount: 38
  },
  {
    id: 'rev-4',
    productId: 'vynora-beauty-001',
    userName: 'Sneha Patel',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Visible results in just 10 days on acne spots!',
    comment: 'Non-sticky, absorbs very quickly into skin without clogging pores. 100% original product with batch code verification. Will definitely order the 50ml refill next time.',
    date: '5 days ago',
    verifiedPurchase: true,
    helpfulCount: 42
  },
  {
    id: 'rev-5',
    productId: 'vynora-accessories-001',
    userName: 'Rohan Deshmukh',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'AMOLED display is buttery smooth and calls are crystal clear.',
    comment: 'Battery easily lasts 5 days on single charge. The metallic dial finish feels like a ₹10,000 luxury watch. Supercoin discount saved me another ₹200.',
    date: 'Yesterday',
    verifiedPurchase: true,
    helpfulCount: 51
  }
];

// Available Promo Codes
export const PROMO_CODES = [
  { code: 'VYNORA10', discountPercent: 10, minOrderValue: 499, description: '10% Instant Discount on orders above ₹499' },
  { code: 'FIRST50', flatDiscount: 150, minOrderValue: 799, description: 'Flat ₹150 OFF on your first purchase' },
  { code: 'FESTIVE20', discountPercent: 20, minOrderValue: 1499, description: '20% Mega Festive Saver up to ₹600' },
  { code: 'SUPERCOIN', flatDiscount: 100, minOrderValue: 399, description: 'Redeem 100 SuperCoins for flat ₹100 cash discount' }
];

export const INITIAL_PRODUCTS: Product[] = generateProducts();
export const PRODUCTS: Product[] = INITIAL_PRODUCTS;
