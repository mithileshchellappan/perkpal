-- Create statement_analyses table
CREATE TABLE IF NOT EXISTS statement_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_statement_analyses_user_id ON statement_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_statement_analyses_card_name ON statement_analyses(card_name);
CREATE INDEX IF NOT EXISTS idx_statement_analyses_period ON statement_analyses(statement_period);

-- Add comment to table
COMMENT ON TABLE statement_analyses IS 'Stores analyses of user credit card statements'; 