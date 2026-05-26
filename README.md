# 🌍 Kafaale Qaad — Humanitarian Aid Platform

> Connecting verified emergency cases in Somalia with global sponsors through a transparent, privacy-first aid distribution system.

## 🚀 Live Stack

| Layer | Tech | Status |
|---|---|---|
| Frontend | React 18 + Vite + React Router | ✅ |
| Backend | Express 5 + TypeScript + Prisma | ✅ |
| Database | SQLite (dev) / PostgreSQL (prod) | ✅ |
| AI | Claude Haiku (assistant) + Sonnet (sanitization) | ✅ |
| Real-time | Socket.io | ✅ |
| Auth | JWT + bcrypt (6 roles) | ✅ |

## 🗺️ Routes

| Path | Description |
|---|---|
| `/` | Home — hero, stats, workflow |
| `/cases` | All verified cases (real API) |
| `/donate` | Sponsor a case |
| `/login` | Sign in / Register (6 roles) |
| `/dashboard` | Full dashboard (role-based) |
| `/about`, `/how-it-works`, `/contact` | Public pages |

## 🏃 Run Locally

```bash
# 1. Backend (Terminal 1)
cd backend
npm install
npx prisma migrate dev
npm run dev      # → http://localhost:4000

# 2. Frontend (Terminal 2)
npm install
npm run dev      # → http://localhost:5173
```

### Demo Accounts (password: `Kafaale123!`)
| Email | Role |
|---|---|
| superadmin@kafaale.org | Super Admin |
| admin@kafaale.org | Admin |
| agent@kafaale.org | Field Agent |
| donor@kafaale.org | Donor |
| reporter@kafaale.org | Reporter |

## 🤖 AI Features

- **AI Assistant** — Floating chat widget on every page (Claude Haiku)
- **AI Sanitization** — Auto-generates privacy-safe public case versions (Claude Sonnet)

Add `ANTHROPIC_API_KEY=sk-ant-...` to `backend/.env` to enable AI features.

## 🚀 Deploy

### Backend → Railway
1. Connect GitHub repo to Railway
2. Set root directory: `backend`
3. Add env vars: `DATABASE_URL`, `JWT_SECRET`, `ANTHROPIC_API_KEY`, `FRONTEND_URL`
4. Railway will auto-deploy on push

### Frontend → Vercel
1. Connect GitHub repo to Vercel
2. Set `VITE_API_URL=https://your-railway-app.railway.app/api`
3. Auto-deploys on push

## 📋 Case Pipeline (11 steps)
```
Reporter Submission → Office Review → Team Assignment → Field Investigation
→ AI Sanitization → Admin Approval → Donor Sponsorship → Delivery → Proof Upload → Completed
```
