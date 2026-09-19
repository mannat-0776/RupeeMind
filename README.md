# RupeeMind — Enterprise AI Personal Finance & Expense Intelligence Platform

RupeeMind is an AI-powered personal finance engine engineered specifically for Indian banking, UPI ecosystems, and multi-modal receipt analysis. Built with React 18, Vite, Material Design 3, Tailwind CSS, Google Gemini 2.5 Flash multimodal vision & NLP, and Supabase.

---

## Key Features

1. **AI Vision Receipt OCR**:
   - Multimodal Gemini 2.5 Flash vision extraction for merchant name, total, subtotal, GST/tax amount, GSTIN, line items, and payment method (UPI, Card, Cash).
   - Confidence scoring engine with interactive verification gate when confidence falls below 80%.

2. **Indian Bank SMS & UPI Parser Engine**:
   - Deterministic and Gemini NLP parsing for all top Indian banks and payment networks: **HDFC, SBI, ICICI, Axis, Kotak, PNB, UPI, Paytm, PhonePe, and Google Pay**.
   - Auto-categorizes into 10 standard categories, extracts account last 4 digits, and tracks available balances.

3. **Financial Intelligence & Advisory**:
   - **Daily Safe-to-Spend**: Real-time calculated daily spending allowance based on monthly budget targets and remaining month days.
   - **Monthly Savings Prediction**: Burn-rate extrapolation model projecting end-of-month savings and runway.
   - **Subscription Detection**: Automated recurring expense identification (Netflix, Spotify, AWS, Gym, Broadband).
   - **Spending Streak Counter**: Daily discipline tracking engine.
   - **Weekend vs Weekday Analytics**: Weekend spending surge analysis and behavioral nudges.
   - **Cash Flow Summary**: Inflow vs Outflow vs Net Savings rate calculations.

4. **Security & Offline-First Persistence**:
   - Full PostgreSQL Row Level Security (RLS) policies isolating user data.
   - IndexedDB offline queueing with automatic background sync when reconnected.
   - API rate limiting (sliding window 60 req/min per IP) and strict input sanitization.

---

## Tech Stack

- **Frontend**: React 18, TypeScript (Strict Mode), Vite, Material UI (MUI v6 / MD3), Emotion, Tailwind CSS, Lucide Icons, Recharts, Framer Motion.
- **State Management**: Zustand with persistent storage.
- **Backend**: Node.js, Express, Google GenAI SDK (`@google/genai`), TSX, esbuild.
- **Database & Auth**: Supabase (PostgreSQL, Row-Level Security, Google OAuth, Triggers).
- **Testing**: Vitest (Unit & Integration tests) + Playwright (E2E tests).

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/your-org/rupeemind.git
cd rupeemind

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run development server
npm run dev
```

### Running Tests
```bash
# Run Vitest unit tests
npx vitest run

# Run E2E tests
npx playwright test
```

---

## Documentation Links
- [API Documentation](docs/API.md)
- [Database Schema & Migrations](docs/DATABASE.md)
- [Deployment Guide (Vercel & Supabase)](docs/DEPLOYMENT.md)
- [Contributing Guidelines](docs/CONTRIBUTING.md)

---

## License
MIT License. Built for fintech scale.
