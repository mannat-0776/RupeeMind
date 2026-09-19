# RupeeMind — Deployment & Production Checklist

This guide outlines step-by-step instructions for deploying RupeeMind to **Vercel** (Frontend / Serverless) and **Supabase** (Database / Auth).

---

## 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and run the initial migration:
   - Copy contents of `supabase/migrations/20260918000001_initial_schema.sql`.
   - Run the script to create tables, indexes, triggers, and RLS policies.
3. Optionally run `supabase/seed.sql` to populate sample transactions and demo data.
4. In **Authentication > Providers**:
   - Enable **Google OAuth** and add your Google Client ID & Secret.
   - Set Authorized Redirect URI: `https://<your-project>.supabase.co/auth/v1/callback` and `https://<your-domain>/auth/callback`.

---

## 2. Environment Variables Configuration

Copy `.env.example` into your production deployment dashboard:

```env
# Gemini AI Configuration
GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Node Environment
NODE_ENV=production
PORT=3000
```

---

## 3. Vercel Deployment

1. Import your GitHub repository to Vercel.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Add all Environment Variables from above.
6. Deploy!

`vercel.json` is pre-configured at the project root for SPA routing and API proxying.

---

## 4. Production Health Verification

Once deployed, verify the health endpoint:
```bash
curl https://your-domain.com/api/health
```

Expected Response:
```json
{
  "status": "ok",
  "app": "RupeeMind Enterprise AI",
  "hasApiKey": true,
  "timestamp": "2026-09-18T10:00:00.000Z"
}
```
