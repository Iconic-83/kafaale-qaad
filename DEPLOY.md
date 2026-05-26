# 🚀 Kafaale Qaad — Full Production Deployment Guide

> One backend serves **both the web app and the mobile app**.
> Stack: **Supabase (PostgreSQL)** + **Railway (API)** + **Vercel (Web)**

---

## Architecture Overview

```
Mobile App (React Native / Expo)
        │
        ▼
Web App (React + Vite)  ──►  Railway API (Node + Express)  ──►  Supabase PostgreSQL
                                      │
                                      ▼
                              Supabase Storage (photos/media)
```

---

## STEP 1 — Supabase Database Setup

1. **Create account**: https://supabase.com (free — 500 MB, plenty for 100k+ cases)
2. Click **New Project**
   - Name: `kafaale-prod`
   - Password: generate a strong one and save it
   - Region: **EU West** (best for Somalia/Middle East)
3. Wait ~2 minutes for provisioning
4. Go to **Settings → Database**
5. Scroll to **Connection string → URI** and copy it

   Looks like:
   ```
   postgresql://postgres:YOUR_PASSWORD@db.abcdefgh.supabase.co:5432/postgres
   ```
6. Also go to **Settings → API** and copy:
   - `Project URL` → your `SUPABASE_URL`
   - `service_role` key → your `SUPABASE_SERVICE_KEY`

---

## STEP 2 — Create Supabase Storage Bucket

1. In Supabase sidebar → **Storage**
2. Click **New Bucket**
   - Name: `kafaale-media`
   - Make it **Private** (field agents upload, not public random access)
3. Add a policy: allow `service_role` full access (default)

---

## STEP 3 — Prepare Backend for PostgreSQL

On your local machine, in the `backend/` folder:

```bash
# 1. Edit prisma/schema.prisma — change ONE line:
#    provider = "sqlite"   →   provider = "postgresql"

# 2. Delete old SQLite migrations (incompatible with Postgres)
rm -rf prisma/migrations

# 3. Set your Supabase URL temporarily for migration
export DATABASE_URL="postgresql://postgres:PASSWORD@db.REF.supabase.co:5432/postgres"

# 4. Create fresh PostgreSQL migrations
npx prisma migrate dev --name init

# 5. Seed the database (creates super_admin, test users, etc.)
npx prisma db seed

# 6. Revert schema.prisma back to sqlite for local dev
#    provider = "postgresql"  →  provider = "sqlite"
#    And restore your .env DATABASE_URL to "file:./dev.db"
```

---

## STEP 4 — Generate Strong JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output — use it as `JWT_SECRET` in Railway.

---

## STEP 5 — Deploy to Railway

1. Go to **https://railway.app** → New Project → **Deploy from GitHub repo**
   - Connect your GitHub and select the `kafaale-web` repo
   - Set the **Root Directory** to `backend`

2. Railway auto-detects the `Dockerfile` and builds it

3. In Railway → your service → **Variables**, add ALL these:

   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | your Supabase PostgreSQL URI |
   | `JWT_SECRET` | the 128-char hex string from Step 4 |
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `ANTHROPIC_API_KEY` | your Claude API key |
   | `BASE_URL` | `https://YOUR-APP.up.railway.app` (fill after first deploy) |
   | `FRONTEND_URL` | `https://kafaale.vercel.app` (or your Vercel URL) |
   | `SUPABASE_URL` | `https://YOUR-REF.supabase.co` |
   | `SUPABASE_SERVICE_KEY` | your Supabase `service_role` key |
   | `SUPABASE_STORAGE_BUCKET` | `kafaale-media` |

4. Click **Deploy** — Railway will:
   - Build the Docker image
   - Run `npx prisma migrate deploy` (applies the migration to Supabase)
   - Start `node dist/server.js`

5. Once deployed, copy the Railway URL (e.g. `https://kafaale-api.up.railway.app`)
   - Update `BASE_URL` variable to that URL

---

## STEP 6 — Deploy Frontend to Vercel

```bash
# In the root kafaale-web/ folder:
npm run build

# Install Vercel CLI if needed:
npm i -g vercel

# Deploy:
vercel --prod
```

When Vercel asks:
- **Framework**: Vite
- **Root**: `./` (root of the repo)
- **Build command**: `npm run build`
- **Output directory**: `dist`

In Vercel → your project → **Settings → Environment Variables**, add:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://kafaale-api.up.railway.app/api` |

Redeploy after adding the variable.

---

## STEP 7 — Mobile App (When Ready)

The mobile app uses the **same Railway API** — no DB changes needed.

In the React Native / Expo app, just set:
```js
const API_URL = 'https://kafaale-api.up.railway.app/api';
```

The JWT auth system already works for any client (web or mobile). All existing endpoints are ready.

---

## Default Login Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| super_admin | superadmin@kafaale.org | Kafaale123! |
| admin | admin@kafaale.org | Kafaale123! |
| field_agent | agent@kafaale.org | Kafaale123! |
| donor | donor@kafaale.org | Kafaale123! |
| reporter | reporter@kafaale.org | Kafaale123! |

> ⚠️ **Change all passwords immediately after first production deploy.**

---

## Cost Summary (Monthly)

| Service | Free Tier | What You Get |
|---------|-----------|--------------|
| Supabase | $0 | 500 MB DB, 1 GB storage, 2 GB bandwidth |
| Railway | $5/mo | 500 hours/mo (24/7 for ~21 days), scales up |
| Vercel | $0 | Unlimited static deploys |
| Claude API | Pay-per-use | ~$0.003 per case AI sanitization |

**Total: ~$0–5/month for early stage**

---

## Local Development (Keep Using SQLite)

```bash
# backend/.env stays as:
DATABASE_URL="file:./dev.db"
# schema.prisma stays as:
provider = "sqlite"

# Just run:
cd backend && npm run dev
cd .. && npm run dev
```

---

## If Something Goes Wrong on Railway

```bash
# Check logs in Railway dashboard → Deployments → View Logs

# Or redeploy manually:
railway up   # if Railway CLI installed
```
