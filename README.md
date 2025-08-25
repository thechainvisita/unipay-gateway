# Unipay Demo — Global Payment Processing Platform

> **Demo Version** — Revolutionary International Payments + Crypto Integration

This is a **demo version** of a next-generation global payment processing platform that seamlessly connects traditional payment methods with cryptocurrency — enabling instant transfers, universal exchange, and frictionless cross-border transactions for businesses and individuals worldwide.

## 🌍 Our Mission

To revolutionize how the world moves money by creating a **unified payment ecosystem** that bridges fiat currencies, digital wallets, credit cards, bank transfers, and cryptocurrencies — making international payments as easy as sending a text message.

This groundbreaking platform combines payment processing, real-time currency exchange, crypto-to-fiat conversion, compliance automation, and intelligent routing — all within one powerful, intuitive experience available on web and mobile.

## 🧠 Platform Vision

To create the **world's most versatile payment infrastructure** — a truly borderless financial system where anyone can send, receive, and exchange value across any currency or payment method instantly, securely, and affordably.

## 🧩 Core Platform Components (Demo)

This demo showcases the foundational features of the platform:

- **Universal Payment Gateway** — Accept cards, bank transfers, digital wallets, and cryptocurrencies
- **Real-Time Exchange Engine** — Instant conversion between fiat currencies and crypto assets
- **Unipay Routing System** — Optimized transaction routing for lowest fees and fastest settlement
- **Multi-Currency Wallets** — Secure custody solution supporting both fiat and crypto balances
- **User Dashboards** — Transaction history, analytics, and payment management interfaces
- **Web3 Integration** — Seamless cryptocurrency payment processing via MetaMask

## 🏗️ Tech Stack

### Frontend
- **React 18** with **TypeScript**
- **Redux** with Redux Thunk
- **Tailwind CSS**
- **React Router**
- **Ethers.js v6** — Web3 integration
- **MetaMask** — Wallet connectivity

### Backend
- **Express.js** with **TypeScript**
- **SQLite** — Database
- **bcryptjs** — Password hashing
- **CoinGecko API** — Real-time crypto prices

### Future Production Stack
- **Backend**: Node.js, Python, NestJS, PostgreSQL, Redis, Kafka
- **Blockchain**: Solidity (EVM), Smart Contracts, Bitcoin Core, Lightning Network
- **Payment Infrastructure**: Stripe Connect, Plaid, Banking APIs, SWIFT, SEPA
- **AI/ML**: TensorFlow, PyTorch for fraud detection and risk scoring
- **Infrastructure**: Docker, AWS/GCP, Kubernetes, Microservices

## 🚀 Quick Start

### Prerequisites

- **Node.js** LTS (18.x or 20.x recommended)
- **pnpm** (install via `npm install -g pnpm`)

Check your versions:

```powershell
node -v
pnpm -v
```

### Installation & Development

1. **Install all dependencies**

```powershell
pnpm install
```

This will install both frontend and backend dependencies in one go.

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Create a `server/.env` file (optional, defaults to port 5000):

```env
PORT=5000
```

4. **Start the backend server**

In one terminal:

```powershell
pnpm run server
```

Or for development with auto-reload:

```powershell
pnpm run server:dev
```

5. **Start the frontend development server**

In another terminal:

```powershell
pnpm start
```

**Or run both together:**

```powershell
pnpm run dev
```

Open http://localhost:3000 in your browser. The app will hot-reload on changes.

**Note**: The backend server runs on http://localhost:5000 and the SQLite database is automatically created in `server/database/unipay.db` on first run.

## 📜 Available Scripts

### Frontend
- `pnpm start` — Start React development server
- `pnpm build` — Build production bundle
- `pnpm test` — Run tests
- `pnpm eject` — Eject CRA config (one-way operation)

### Backend
- `pnpm run server` — Start Express backend server
- `pnpm run server:dev` — Start backend with nodemon (auto-reload)
- `pnpm run dev` — Run both frontend and backend concurrently

## 📁 Project Structure

```
├── server/                 # Express backend (TypeScript)
│   ├── database/          # SQLite database
│   ├── routes/            # API routes
│   └── server.ts          # Server entry point
├── src/                   # React frontend (TypeScript)
│   ├── components/        # React components
│   ├── pages/             # Route pages
│   ├── redux/             # State management
│   ├── services/          # API services
│   └── router/            # Route configuration
└── package.json           # Dependencies
```

## 🔐 Authentication & User Roles

**Backend Authentication**: All authentication is handled by the Express backend with SQLite database. Passwords are securely hashed using bcryptjs.

### User Roles

- **Users** — Send payments, manage transactions, view purchase history and rewards
- **Merchants** — Accept payments, manage transactions, view analytics and settlement data

### How It Works

- User authentication via Express backend
- Passwords hashed with bcryptjs
- All data stored in SQLite database
- Session stored in browser localStorage

## 💳 Payment Integration

### Payment Methods

- **Cryptocurrency** — Ethereum via MetaMask
- **Credit Card** — Card payments
- **Bank Transfer** — Direct bank transfers
- **Real-time Crypto Prices** — Powered by CoinGecko API

### Future Payment Features

- **50+ Cryptocurrencies** — Bitcoin, Ethereum, stablecoins, and major altcoins
- **150+ Fiat Currencies** — Real-time exchange rates and conversion
- **Multiple Payment Rails** — Cards, ACH, wire transfers, SEPA, SWIFT
- **Digital Wallets** — Apple Pay, Google Pay, PayPal integration
- **Unipay Routing** — AI-optimized routing for lowest fees and fastest settlement

## 🧪 Testing

```powershell
pnpm test
```

## 🚢 Deployment

Build the production bundle:

```powershell
pnpm build
```

Then serve the `build/` folder with any static host:
- **Netlify** — Connect your Git repo for automatic deployments
- **Vercel** — Zero-config deployment for React apps
- **GitHub Pages** — Use gh-pages adapter
- **AWS S3 + CloudFront** — For enterprise deployments

## 🐛 Troubleshooting

- **Port conflicts**: App will prompt to use another port if 3000 is in use
- **Backend not starting**: Ensure port 5000 is available
- **MetaMask errors**: Install MetaMask extension and connect wallet

## 🗓️ Product Roadmap

| **Phase** | **Focus** | **Timeline** |
| --- | --- | --- |
| MVP | Core payment processing, crypto acceptance, basic currency exchange | Q1 2026 |
| v1 Launch | Multi-currency wallets, mobile app, merchant APIs, 20+ crypto assets | Q2 2026 |
| v2 AI Suite | Unipay routing, fraud detection, risk scoring, exchange optimization | Q3 2026 |
| Global Expansion | 150+ countries, institutional accounts, DeFi integration, stablecoin rails | Q4 2026 |

## 📝 Notes

- Demo version with SQLite database
- Backend server required for full functionality
- Database auto-created on first run
- Built with TypeScript for type safety

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` — User login
- `POST /api/auth/signup` — User registration

### Checkout
- `GET /api/checkout/goods/:method` — Get goods by payment method
- `GET /api/checkout/cryptos` — Get all cryptocurrencies
- `GET /api/checkout/cryptos/:type` — Get crypto by type
- `GET /api/checkout/cards/:userId` — Get user cards
- `GET /api/checkout/banks/:userId` — Get user banks
- `POST /api/checkout/cards` — Save new card
- `POST /api/checkout/banks` — Save new bank

### Dashboard
- `GET /api/dashboard/:userEmail` — Get dashboard data

### Purchases & Rewards
- `POST /api/purchases` — Create purchase record
- `POST /api/rewards` — Create reward record

### Health Check
- `GET /api/health` — Server health status

## 🤝 Contributing

This is a demo version. Contributions and feedback are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and patterns
- Write tests for new features
- Update documentation as needed
- Ensure all linting checks pass

## 📄 License

This project is a demo version. Add a license file (e.g., MIT) if you plan to publish or share this repository publicly.

## 🙏 Acknowledgements

Built with React, Express, TypeScript, SQLite, Tailwind CSS, Redux, and Ethers.js.
