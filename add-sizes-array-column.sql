-- Add sizes array column to products table if it doesn't exist
-- Run this in Supabase SQL Editor to add the column to existing database

-- Add sizes column with default empty array
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS sizes TEXT[] DEFAULT '{}';

-- Update existing products with default sizes based on current size column
UPDATE products 
SET sizes = ARRAY[size] 
WHERE sizes IS NULL AND size IS NOT NULL;

-- Update products that don't have size to have default 'M'
UPDATE products 
SET sizes = ARRAY['M'] 
WHERE sizes IS NULL OR array_length(sizes, 1) IS NULL;

-- Drop the old size column if it exists
ALTER TABLE products 
DROP COLUMN IF EXISTS size;

-- Create index for better performance on sizes queries
CREATE INDEX IF NOT EXISTS idx_products_sizes ON products USING GIN(sizes);

-- Optional: Add a comment to document the column
COMMENT ON COLUMN products.sizes IS 'Array of available sizes for the product (S, M, L, XL, XXL)';
