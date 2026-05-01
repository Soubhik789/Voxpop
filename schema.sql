-- ============================================================
-- Customer Voting System — Database Schema
-- Run this in your Supabase SQL Editor to set up all tables
-- ============================================================

-- 1. Products table
CREATE TABLE IF NOT EXISTS products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  image_url   TEXT,
  category    TEXT NOT NULL DEFAULT 'General',
  vote_count  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Votes table (tracks per-IP, per-product votes for rate limiting)
CREATE TABLE IF NOT EXISTS votes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_ip    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Unique constraint: one vote per IP per product
CREATE UNIQUE INDEX IF NOT EXISTS votes_product_ip_unique
  ON votes(product_id, user_ip);

-- 4. Index for fast leaderboard queries
CREATE INDEX IF NOT EXISTS products_vote_count_idx
  ON products(vote_count DESC);

-- 5. Index for fast vote lookup
CREATE INDEX IF NOT EXISTS votes_product_id_idx
  ON votes(product_id);

-- 6. Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes    ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies — public read on products
CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  USING (true);

-- 8. RLS Policies — votes managed by service role only (API routes)
CREATE POLICY "Service role can manage votes"
  ON votes FOR ALL
  USING (true);

CREATE POLICY "Service role can update product vote counts"
  ON products FOR UPDATE
  USING (true);

-- ============================================================
-- Seed Data — 12 sample products across 4 categories
-- ============================================================

INSERT INTO products (name, description, image_url, category, vote_count) VALUES
  (
    'ArcLight Desk Lamp',
    'Adjustable LED desk lamp with wireless charging base and 5-level dimming. Designed for marathon work sessions.',
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80',
    'Electronics',
    142
  ),
  (
    'Nomad Leather Wallet',
    'Slim bifold wallet hand-stitched from full-grain Italian leather. Holds 8 cards with RFID blocking.',
    'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80',
    'Accessories',
    98
  ),
  (
    'BrewMaster Pour-Over Kit',
    'Professional coffee pour-over set with gooseneck kettle, glass carafe, and precision filters.',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    'Kitchen',
    87
  ),
  (
    'CloudFoam Running Shoes',
    'Ultra-lightweight trainers with responsive foam midsole and breathable engineered mesh upper.',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    'Footwear',
    203
  ),
  (
    'Marble & Steel Pen Set',
    'Executive writing set featuring a marbled resin barrel and stainless nib. Comes in a magnetic gift box.',
    'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&q=80',
    'Accessories',
    61
  ),
  (
    'SoundBlock Headphones',
    'Over-ear headphones with active noise cancellation, 40-hour battery, and foldable design.',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    'Electronics',
    176
  ),
  (
    'Cast Iron Skillet 10"',
    'Pre-seasoned cast iron skillet for stovetop, oven, and campfire use. Lasts a lifetime.',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    'Kitchen',
    54
  ),
  (
    'Alpine Daypack 22L',
    'Weather-resistant backpack with laptop sleeve, hidden pockets, and ergonomic shoulder straps.',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    'Accessories',
    119
  ),
  (
    'MechKey Keyboard',
    'Compact 75% mechanical keyboard with hot-swappable switches, per-key RGB, and aluminum case.',
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80',
    'Electronics',
    88
  ),
  (
    'Bamboo Knife Block Set',
    '6-piece high-carbon stainless steel knife set with sustainable bamboo storage block.',
    'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&q=80',
    'Kitchen',
    43
  ),
  (
    'Trail Runner GTX',
    'Gore-Tex waterproof trail shoes with aggressive lugged outsole and rock protection plate.',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80',
    'Footwear',
    167
  ),
  (
    'Smart Watch Series X',
    'Health-focused smartwatch with ECG, SpO2, always-on AMOLED display, and 7-day battery.',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    'Electronics',
    231
  )
ON CONFLICT DO NOTHING;

-- ============================================================
-- Done! Your database is ready.
-- ============================================================
