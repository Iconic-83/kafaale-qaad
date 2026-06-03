# Kafaale Qaad — Disaster Recovery Runbook
**Target RTO (Recovery Time Objective):** 4 hours  
**Target RPO (Recovery Point Objective):** 24 hours (Supabase daily backup)

---

## Scenario 1 — Render/Railway Goes Down

**Symptoms:** API returns 503 or is completely unreachable. Mobile app shows network errors.

**Steps:**
1. Check Render/Railway status page
2. If outage > 30 minutes, redeploy to the other platform:
   - From Render → deploy to Railway: `cd backend && railway up`
   - From Railway → deploy to Render: push to GitHub, Render auto-deploys
3. Update `EXPO_PUBLIC_API_URL` in mobile app `.env` and rebuild
4. Expected recovery time: **30–60 minutes**

**Prevention:** Set up uptime monitoring at uptimerobot.com (free, checks every 5 min)

---

## Scenario 2 — Supabase Database Goes Down

**Symptoms:** API returns 500 errors. Logs show `PrismaClientKnownRequestError` or connection refused.

**Steps:**
1. Check Supabase status at status.supabase.com
2. If regional outage, Supabase will recover automatically (usually < 1 hour)
3. If project-level issue, contact Supabase support with project ID: `sdfjckovzhtospxdvuaf`
4. To restore from backup:
   - Go to Supabase Dashboard → Project → Database → Backups
   - Select the most recent backup (up to 7 days back on free plan)
   - Click "Restore" — note: this overwrites current data
5. After restore, run: `npx prisma db push` to ensure schema is current
6. Expected recovery time: **1–3 hours** (mostly waiting for Supabase restore)

**Data loss risk:** Maximum 24 hours if last backup was yesterday

---

## Scenario 3 — Claude AI API Fails

**Symptoms:** AI sanitization fails. Cases cannot be auto-published.

**Impact:** LOW — core workflow continues. Only auto-sanitization is affected.

**Steps:**
1. The system automatically notifies office staff/admins: "⚠️ AI Unavailable — Manual Review Needed"
2. Admin uses the demo sanitization mode (built-in fallback, no AI needed)
3. To trigger demo sanitization: `POST /api/ai/sanitize/:caseId` still works without API key — uses template-based output
4. Cases can still be manually reviewed and published by office staff
5. When Claude API recovers, pending cases can be re-sanitized

**Prevention:** None needed — fallback is automatic

---

## Scenario 4 — Expo Push Notifications Fail

**Symptoms:** Users stop receiving push notifications.

**Impact:** LOW — in-app notifications and WebSocket notifications still work.

**Steps:**
1. Check Expo status at status.expo.dev
2. If Expo push is down, the system automatically:
   - Shows notifications in-app (always works — stored in DB)
   - Delivers via WebSocket for active users
   - Attempts email fallback if SMTP is configured
3. No action required — notifications are not lost, just delayed
4. When Expo push recovers, new notifications will be delivered normally
5. Old notifications remain in the in-app notification center

---

## Scenario 5 — Full System Rebuild from Zero

If everything is lost (server deleted, database gone), rebuild in this order:

**Time estimate: 2–4 hours**

### Step 1: Restore Database (30 min)
```bash
# Create new Supabase project
# Go to supabase.com → New Project → Somalia region
# Get DATABASE_URL and DIRECT_URL from Project Settings → Database
```

### Step 2: Restore Application Code (5 min)
```bash
git clone https://github.com/Iconic-83/kafaale-qaad.git
cd kafaale-qaad/backend
npm ci
npx prisma generate
npx prisma db push   # recreates all tables
```

### Step 3: Restore Environment Variables (15 min)
Set these in your deployment platform:
```
DATABASE_URL=<from Supabase>
DIRECT_URL=<from Supabase>
JWT_SECRET=<from password manager>
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_SERVICE_KEY=<from Supabase>
ANTHROPIC_API_KEY=<from console.anthropic.com>
FRONTEND_URL=https://kafaale-qaad.vercel.app
NODE_ENV=production
PORT=5000
```

### Step 4: Deploy Backend (15 min)
```bash
# Render: push to GitHub, auto-deploys
# Railway: railway up
# Fly.io: flyctl deploy
```

### Step 5: Restore Mobile (30 min)
```bash
git clone https://github.com/Iconic-83/kafaale-qaad-mobile.git
cd kafaale-qaad-mobile
npm install
# Update EXPO_PUBLIC_API_URL in .env if server URL changed
eas build --platform android
```

### Step 6: Restore Data (1–3 hours)
- If Supabase project was deleted: data is GONE (no external backup)
- If only the server was deleted: data is safe in Supabase
- To seed initial data: `npx ts-node --transpile-only prisma/seed.ts`

---

## Backup Checklist (Do Monthly)

- [ ] Export env vars to password manager
- [ ] Download Supabase database backup: Dashboard → Backups → Download
- [ ] Verify GitHub repos are up to date: `git log --oneline -3`
- [ ] Test restore procedure on a staging environment
- [ ] Update this runbook if anything has changed

---

## Key Contacts & Resources

| Resource | URL |
|---|---|
| Supabase Dashboard | supabase.com/dashboard |
| Supabase Status | status.supabase.com |
| Railway Dashboard | railway.app/dashboard |
| Render Dashboard | dashboard.render.com |
| Expo Status | status.expo.dev |
| GitHub Repos | github.com/Iconic-83 |
| Anthropic Console | console.anthropic.com |

---

## Recovery Test (Run Quarterly)

1. Spin up a test environment
2. Run `prisma db push` against a blank test database
3. Seed test data: `ts-node prisma/seed.ts`
4. Run `npx ts-node src/scripts/simulateE2ETest.ts`
5. Verify all 8 workflow steps complete
6. Document recovery time
7. Update this runbook
