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
  expires_at TIMESTAMPTZ, -- Add expiration date for TTL
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

-- Table for card comparisons cache
CREATE TABLE IF NOT EXISTS card_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cards_to_compare JSONB NOT NULL, -- Array of card objects
  country TEXT NOT NULL,
  comparison_data JSONB NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  UNIQUE (cards_to_compare, country)
);

-- Create index for card comparisons
CREATE INDEX IF NOT EXISTS idx_card_comparisons_country ON card_comparisons(country);

-- Table for ecommerce rewards cache
CREATE TABLE IF NOT EXISTS ecommerce_rewards (
  id SERIAL PRIMARY KEY,
  country TEXT NOT NULL,
  cards_key TEXT NOT NULL,
  rewards_data JSONB NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  UNIQUE(country, cards_key)
);

-- Create index for ecommerce rewards
CREATE INDEX IF NOT EXISTS idx_ecommerce_rewards_country ON ecommerce_rewards(country);

-- Create statement_analyses table
CREATE TABLE IF NOT EXISTS statement_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  card_name TEXT NOT NULL,
  issuing_bank TEXT NOT NULL,
  country TEXT NOT NULL,
  statement_period TEXT NOT NULL,
  total_points_earned INTEGER NOT NULL,
  total_potential_points INTEGER NOT NULL,
  points_missed_percentage FLOAT NOT NULL,
  categories JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_card_period UNIQUE (user_id, card_name, issuing_bank, statement_period)
);

-- Create indexes for statement analyses
CREATE INDEX IF NOT EXISTS idx_statement_analyses_user_id ON statement_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_statement_analyses_card_name ON statement_analyses(card_name);
CREATE INDEX IF NOT EXISTS idx_statement_analyses_period ON statement_analyses(statement_period);

-- Add comment to statement_analyses table
COMMENT ON TABLE statement_analyses IS 'Stores analyses of user credit card statements';

-- Create a notifications type enum
CREATE TYPE notification_type AS ENUM (
  'new_offer',
  'transfer_bonus',
  'merchant_offer',
  'seasonal_promotion'
);

-- Create the notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_issuer TEXT NOT NULL,
  card_name TEXT NOT NULL,
  notification_type notification_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  source_url TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create index on card_issuer and card_name for faster lookups
CREATE INDEX IF NOT EXISTS notifications_card_idx ON notifications (card_issuer, card_name);

-- Create the user_notifications table
CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- Clerk user ID
  notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS user_notifications_user_id_idx ON user_notifications (user_id);

-- Create a unique constraint to prevent duplicate notifications per user
CREATE UNIQUE INDEX IF NOT EXISTS user_notifications_unique_idx ON user_notifications (user_id, notification_id);

-- Enable RLS on notification tables
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- Simple policies for notification tables - allow all access for now
CREATE POLICY all_access_notifications ON notifications FOR ALL USING (true);
CREATE POLICY all_access_user_notifications ON user_notifications FOR ALL USING (true);
