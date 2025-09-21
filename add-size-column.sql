-- Add size column to products table if it doesn't exist
-- Run this in Supabase SQL Editor to add the column to existing database

-- Add size column with default value
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS size VARCHAR(10) DEFAULT 'M';

-- Update existing products with default size
UPDATE products 
SET size = 'M' 
WHERE size IS NULL;

-- Create index for better performance on size queries
CREATE INDEX IF NOT EXISTS idx_products_size ON products(size);

-- Optional: Add a comment to document the column
COMMENT ON COLUMN products.size IS 'Product size (S, M, L, XL, XXL)';
