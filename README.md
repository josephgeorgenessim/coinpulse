# 🪙 CoinPulse - Professional Crypto Tracker

**CoinPulse** is a premium, real-time cryptocurrency tracking platform built with Next.js and the CoinGecko API. It provides users with live market data, interactive candlestick charts, and a global search engine designed for speed and precision.

---

## ✨ Key Features

### 🔍 Global Search Engine
- **Command + K**: Instantly open the search modal from any page.
- **Fast Search**: Debounced queries to find any coin globally.
- **Keyboard Friendly**: Navigate results with arrow keys and `Enter` to select.

### 📈 Live Coin Detail Pages
- **Real-Time Prices**: Live price updates powered by **WebSockets**.
- **Automatic Fallback**: Intelligent "Polling Mode" that automatically takes over if WebSockets are unavailable (e.g., on Free API plans).
- **Interactive Charts**: High-performance candlestick charts using `lightweight-charts` with timeframe selection (1D, 1W, 1M, etc.).

### 📊 Comprehensive Market Stats
- **Detailed Analytics**: Market Cap, 24h Volume, Circulating Supply, and Fully Diluted Valuation.
- **Visual Indicators**: Real-time status badges showing update frequency and connection state.
- **Clean UI**: Modern, dark-themed interface built for readability and premium feel.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Data Source**: [CoinGecko API](https://www.coingecko.com/en/api)
- **Charts**: [Lightweight Charts](https://tradingview.github.io/lightweight-charts/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks & Context

---

## 🚀 Getting Started

### 1. Requirements
- Node.js 18+
- A CoinGecko API Key (Demo or Pro)

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_COINGECKO_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_COINGECKO_WS_URL=wss://stream.coingecko.com/v1
COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
COINGECKO_API_KEY=YOUR_API_KEY
```

### 3. Installation
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License
This project is licensed under the MIT License.
