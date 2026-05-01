# VoxPop — Customer Voting System

A full-stack customer voting platform built with **Next.js 14**, **Tailwind CSS**, and **Supabase**. Features a live leaderboard, responsive product grid, real-time vote counts, and IP-based rate limiting.

*Feature

- **Live Leaderboard** — Products ranked by vote count, auto-refreshes every 30 seconds
- **Responsive Product Grid** — Works beautifully on mobile, tablet, and desktop
- **Dynamic Vote Buttons** — Optimistic updates with server confirmation
- **Search & Filter** — Instant client-side filtering by name and category
- **Rate Limiting** — One vote per product per IP address (enforced in DB + API)
- **Vercel-optimized** — Zero-config deployment with Edge-friendly API routes

---

*Deployment Guide

### Step 1 — Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New Project** — choose a name, database password, and region
3. Once provisioned, open the **SQL Editor** (left sidebar)
4. Copy the contents of `schema.sql` and paste it into the editor
5. Click **Run** — this creates your tables and seeds 12 sample products

### Step 2 — Get your API keys

In your Supabase project:
1. Go to **Settings → API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` *(keep this secret!)*

### Step 3 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/customer-voting.git
git push -u origin main
```

### Step 4 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and log in with GitHub
2. Click **Add New → Project**
3. Import your `customer-voting` repository
4. In **Environment Variables**, add:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |

5. Click **Deploy** 🎉

Your site will be live at `https://your-project.vercel.app` with a free SSL certificate.

---

## 🛠 Local Development

```bash
# Clone and install
npm install

# Copy env file and fill in your keys
cp .env.example .env.local

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```
customer-voting/
├── app/
│   ├── api/
│   │   ├── products/route.ts   # GET all products sorted by votes
│   │   └── vote/route.ts       # POST cast a vote (rate limited)
│   ├── globals.css             # Design tokens + animations
│   ├── layout.tsx              # Root layout + metadata
│   └── page.tsx                # Server component (SSR initial data)
├── components/
│   ├── VotingApp.tsx           # Main client component (state + logic)
│   ├── ProductCard.tsx         # Individual product card
│   ├── Leaderboard.tsx         # Ranked list view
│   └── SearchFilter.tsx        # Search input + category pills
├── lib/
│   └── supabase.ts             # Supabase client (public + admin)
├── schema.sql                  # DB setup script (run in Supabase)
├── vercel.json                 # Vercel deployment config
└── .env.example                # Environment variable template
```

---

## 🗄 Database Schema

```sql
products (id, name, description, image_url, category, vote_count, created_at)
votes    (id, product_id, user_ip, created_at)
         UNIQUE INDEX on (product_id, user_ip)  -- enforces 1 vote/IP/product
```

---

## 🔒 Rate Limiting

Rate limiting is enforced at **two layers**:

1. **Database** — A `UNIQUE INDEX` on `(product_id, user_ip)` means a second insert returns a Postgres `23505` error, which the API catches and returns as HTTP 429.
2. **Client** — Voted product IDs are stored in `localStorage` so voted buttons are disabled immediately without waiting for the server.

---

## 📝 Adding Your Own Products

After running `schema.sql`, you can add products via the Supabase Table Editor or with SQL:

```sql
INSERT INTO products (name, description, image_url, category)
VALUES (
  'My Product',
  'A great description.',
  'https://example.com/image.jpg',
  'Electronics'
);
```

---

## License

MIT
