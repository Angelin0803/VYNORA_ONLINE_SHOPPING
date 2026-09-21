# Vynora - Modern Multi-Category Online Shopping Platform with CI/CD Pipeline

Inspired by the best features of **Meesho** (Direct Manufacturer Wholesale Pricing & Reseller Mode), **Amazon** (Vynora Assured Badging, Prime-speed Express Tracking & Authentic Customer Reviews), and **Flipkart** (SuperCoins Rewards, Price Drop Alerts, Bank Offers).

---

## Quick Start in VS Code

1. **Extract the ZIP file** to a local directory.
2. Open the directory in **Visual Studio Code** (`code .`).
3. Open a terminal (`Ctrl + ~` or `Cmd + ~`) and install dependencies:
   ```bash
   npm install
   ```
4. Start the Full-Stack Application:
   ```bash
   npm run dev
   ```
   or start the standalone Express backend server:
   ```bash
   npm run server
   ```
5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## Key Features & Architecture

- **Comprehensive Dataset**: 200+ rich products (50+ in Clothes for All Ages, 50+ in Footwear, 50+ in Beauty & Personal Care, 50+ in Smart Accessories).
- **Voice Search**: Native Web Speech API integration for instant voice shopping.
- **Visual Image Search**: Upload any photo or choose style samples to find visually matching products.
- **Reviews & Ratings Engine**: Star distribution breakdown, verified buyer reviews, upvoting, and new review submissions.
- **Express Order Tracking**: Real-time status pipeline (Order Placed -> Packed -> Shipped -> Out for Delivery -> Delivered) with tracking numbers and cancellation/refund capability.
- **Vynora Club (Wholesale Deals)**: Toggle wholesale pricing like Meesho for bulk savings.
- **Vynora SuperCoins**: Earn 5% cashback coins on every purchase and redeem at checkout.
- **Complete CI/CD Pipeline**: GitHub Actions workflow (`.github/workflows/ci-cd.yml`) and multi-stage Dockerfile included.
