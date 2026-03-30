# MF Portfolio X-Ray 🔍

> **ET Gen AI Hackathon 2026 — Phase 2 Submission**  
> Problem Statement #9: AI Money Mentor · Solo submission by Sirisha D

**Live App:** https://fund-xray-vision.vercel.app  

---

## The Problem

India has **14 crore+ demat accounts**. Most retail investors are flying blind — they don't know their real returns, they're paying hidden fees silently, and their funds overlap in ways they can't see. A SEBI-registered financial advisor costs ₹25,000+/year and serves only HNIs.

**MF Portfolio X-Ray solves this in 10 seconds, for free.**

---

## What It Does

![Workflow Diagram](Work_flow.png)

---
## Features

### Core Portfolio Analysis
| Feature | Description |
|---|---|
| **True XIRR** | Newton-Raphson across all SIP transactions — not simple returns |
| **Portfolio Overlap** | Detects when multiple funds hold the same underlying stocks |
| **Expense Drag** | Calculates exactly how much hidden fees cost you in ₹/year |
| **Portfolio Health Score** | 0–100 score across Performance, Diversification, Cost Efficiency, Risk Alignment |
| **Benchmark Comparison** | Your XIRR vs Nifty 50 across 1Y, 3Y, 5Y periods |

### AI-Powered Intelligence
| Feature | Description |
|---|---|
| **Claude Parser Agent** | Reads messy, multi-page CAMS PDFs → structured fund data |
| **Insights Agent** | 3 specific recommendations with ₹ impact estimates and fund names |
| **AI Chat** | Floating advisor — "Why is my score low?" gets a portfolio-aware answer |
| **Hidden Risk Detector** | Sector overexposure heatmap, stock concentration, zero-debt alerts |

### PS #9 Required Features
| Feature | Description |
|---|---|
| **Money Health Score** | 5-min onboarding → 6-dimension wellness score (Emergency Fund, Insurance, Investments, Debt Health, Tax Efficiency, Retirement Readiness) |
| **FIRE Path Planner** | Corpus calculator, retirement age slider, month-by-month SIP roadmap |
| **Scenario Simulator** | Tweak SIP + horizon + return rate → see projected future wealth |
| **Red Flags Engine** | High/Medium/Low severity alerts with specific ₹ figures |
| **Score Breakdown** | Weighted breakdown showing exactly why you lost or gained points |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    User Browser                      │
│  Login → Onboarding → Upload → Loading → Dashboard  │
└────────────────────────┬────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────┐
│            Node.js + Express 5 API                   │
│  POST /api/analyze/upload    → Parser Agent          │
│  POST /api/analyze/portfolio → Financial Calculator  │
│  POST /api/analyze/insights  → Insights Agent        │
│  POST /api/analyze/chat      → Chat Agent            │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│           Four Claude AI Agents                      │
│  Parser     → PDF text → structured JSON             │
│  Calculator → XIRR, overlap, expense, score          │
│  Insights   → recommendations, red flags, plan       │
│  Chat       → portfolio-aware conversational Q&A     │
└─────────────────────────────────────────────────────┘
```

### Agent Roles in Detail

**Agent 1 — Parser** takes raw PDF text (messy, multi-page, inconsistent formatting) and extracts a clean JSON array of fund holdings with name, category, invested amounts, current value, NAV, and transaction history.

**Agent 2 — Calculator** is pure deterministic math. XIRR via Newton-Raphson iteration, overlap detection via category holdings map, expense drag using AMFI category benchmarks, health score weighted across 4 dimensions.

**Agent 3 — Insights** receives the portfolio + metrics and returns structured JSON with specific recommendations (naming actual funds), red flags with real numbers, a rebalancing plan, and projected ₹ impact.

**Agent 4 — Chat** is a stateful Q&A layer with the full portfolio injected as system context. Answers like "Why is my score low?" reference actual numbers from the user's portfolio, not generic advice.

---

## Tech Stack

```
| Feature     | Description                                                                 |
|-------------|-----------------------------------------------------------------------------|
| Frontend    | React 18 + TypeScript, Vite 5, Tailwind CSS, Recharts, Framer Motion        |
| Backend     | Node.js + Express 5, pdf-parse, Newton–Raphson XIRR, multer, CORS, dotenv   |
| AI          | Anthropic Claude Sonnet v4 via Anthropic SDK; multi-agent architecture     |
| Hosting     | Vercel (frontend) and Render (backend) — both using free tiers              |
| Estimated Cost | ₹0 / month                                                              |

```
## Impact Model

```
India active MF investors:       5 crore
Without structured analysis:     ~4.5 crore (90%)

Value per user per year:
  Hidden fees caught:            avg ₹7,500
  Time saved (4hr Excel work):   ₹1,200
  Advisor fee displaced:         ₹25,000 (for those who pay)

At 0.1% ET platform adoption — 45,000 users:
  Expense drag savings:          ₹33.75 crore/year
  Time value returned:           ₹5.4 crore/year
  Total value created:           ₹39+ crore/year

At 1% adoption — 4.5 lakh users: ₹390 crore/year
```

---

## Local Setup

### Backend

```bash
git clone https://github.com/Sirishagowda2025/mf-portfolio-xray
cd mf-portfolio-xray
npm install
```

Create `.env`:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
PORT=3001
```

```bash
npm run dev
# API running at http://localhost:3001
# Health check: http://localhost:3001/api/health
```

### Frontend

```bash
git clone https://github.com/Sirishagowda2025/fund-xray-vision
cd fund-xray-vision
npm install
```

Create `.env`:
```
VITE_API_URL=http://localhost:3001
```

```bash
npm run dev
# App at http://localhost:5173
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health + API key status |
| `POST` | `/api/analyze/upload` | Upload PDF → parsed portfolio + metrics |
| `POST` | `/api/analyze/portfolio` | Fund array → calculated metrics |
| `POST` | `/api/analyze/insights` | Portfolio + metrics → AI recommendations |
| `POST` | `/api/analyze/chat` | Question + context → AI answer |

---

## Deployment

**Backend → Render.com**
1. Connect repo `mf-portfolio-xray` → Build: `npm install` → Start: `npm start`
2. Add env var: `ANTHROPIC_API_KEY`

**Frontend → Vercel**
1. Connect repo `fund-xray-vision`
2. Add env var: `VITE_API_URL=https://mf-portfolio-xray.onrender.com`

---

*Sirisha D · ET Gen AI Hackathon 2026 · Powered by Claude Sonnet 4 (Anthropic)*
