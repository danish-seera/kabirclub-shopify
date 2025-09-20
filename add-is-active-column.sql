-- Add is_active column to products table if it doesn't exist
-- Run this in Supabase SQL Editor to add the column to existing database

-- Add is_active column with default value true
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing products to be active by default
UPDATE products 
SET is_active = true 
WHERE is_active IS NULL;

-- Create index for better performance on is_active queries
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- Optional: Add a comment to document the column
COMMENT ON COLUMN products.is_active IS 'Whether the product is active and visible to customers';
