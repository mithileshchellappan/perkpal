-- Supabase SQL migration script
-- Run this in the Supabase SQL Editor to create the required tables

-- Table for storing card analysis
CREATE TABLE IF NOT EXISTS card_analyses (
  card_name TEXT NOT NULL,
  issuing_bank TEXT NOT NULL,
  country TEXT NOT NULL,
  analysis_data JSONB NOT NULL,
  base_value DECIMAL,
  base_value_currency TEXT,
  annual_fee DECIMAL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (card_name, issuing_bank, country)
);

-- Table for row-based card suggestions
CREATE TABLE IF NOT EXISTS bank_card_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name TEXT NOT NULL,
  card_name TEXT NOT NULL,
  country TEXT NOT NULL,
  brief_description TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (bank_name, card_name, country)
);

-- Create index for better bank card product lookups
CREATE INDEX IF NOT EXISTS idx_bank_card_products_bank ON bank_card_products(bank_name, country);

-- Table for storing partner programs
CREATE TABLE IF NOT EXISTS partner_programs (
  card_name TEXT NOT NULL,
  issuing_bank TEXT NOT NULL,
  country TEXT NOT NULL,
  partners_data JSONB NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (card_name, issuing_bank, country)
);

-- Table for user cards
CREATE TABLE IF NOT EXISTS user_cards (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  bin TEXT NOT NULL,
  card_product_name TEXT NOT NULL,
  issuing_bank TEXT NOT NULL,
  network TEXT NOT NULL,
  country TEXT NOT NULL,
  points_balance DECIMAL,
  last4_digits TEXT,
  card_analysis_data JSONB,
  added_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, id)
);

-- Table for card points history
CREATE TABLE IF NOT EXISTS card_points_history (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  card_id UUID NOT NULL REFERENCES user_cards(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  points_balance DECIMAL NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, card_id, year, month)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_cards_user_id ON user_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_card_points_history_user_id ON card_points_history(user_id);
CREATE INDEX IF NOT EXISTS idx_card_points_history_card_id ON card_points_history(card_id);
CREATE INDEX IF NOT EXISTS idx_card_points_history_year_month ON card_points_history(year, month);

-- Create Row Level Security (RLS) policies
-- These policies ensure that users can only access their own data

-- Enable RLS on the tables
ALTER TABLE user_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_points_history ENABLE ROW LEVEL SECURITY;

-- Create policies for user_cards
CREATE POLICY user_cards_select_policy ON user_cards
  FOR SELECT USING (user_id = auth.uid()::TEXT);

CREATE POLICY user_cards_insert_policy ON user_cards
  FOR INSERT WITH CHECK (user_id = auth.uid()::TEXT);

CREATE POLICY user_cards_update_policy ON user_cards
  FOR UPDATE USING (user_id = auth.uid()::TEXT);

CREATE POLICY user_cards_delete_policy ON user_cards
  FOR DELETE USING (user_id = auth.uid()::TEXT);

-- Create policies for card_points_history
CREATE POLICY card_points_history_select_policy ON card_points_history
  FOR SELECT USING (user_id = auth.uid()::TEXT);

CREATE POLICY card_points_history_insert_policy ON card_points_history
  FOR INSERT WITH CHECK (user_id = auth.uid()::TEXT);

CREATE POLICY card_points_history_update_policy ON card_points_history
  FOR UPDATE USING (user_id = auth.uid()::TEXT);

CREATE POLICY card_points_history_delete_policy ON card_points_history
  FOR DELETE USING (user_id = auth.uid()::TEXT);

-- Table for cached promotions
CREATE TABLE IF NOT EXISTS cached_promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_name TEXT NOT NULL,
  issuing_bank TEXT NOT NULL,
  country TEXT NOT NULL,
  rewards_program_key TEXT NOT NULL, -- Stores rewardsProgram, or empty string if null/undefined
  promotions_data JSONB NOT NULL, -- Stores the full object from PromotionSpotlightResponse
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Create a unique index for cache lookups and upserts
CREATE UNIQUE INDEX IF NOT EXISTS uq_promotion_cache 
ON cached_promotions(card_name, issuing_bank, country, rewards_program_key);

-- Optional: Row Level Security (RLS) - By default, table is accessible. 
-- Consider adding RLS if needed, e.g., allow only service_role to write.
-- ALTER TABLE cached_promotions ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow read access to all users" ON cached_promotions FOR SELECT USING (true);
-- CREATE POLICY "Allow insert/update by service_role" ON cached_promotions FOR ALL USING (auth.role() = 'service_role'); 