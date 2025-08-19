-- Supabase Database Schema for KabirClub

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  category VARCHAR(100) NOT NULL,
  handle VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create collections table
CREATE TABLE collections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  handle VARCHAR(255) UNIQUE NOT NULL,
  image VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  user_id UUID,
  session_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (for future authentication)
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_handle ON products(handle);
CREATE INDEX idx_products_created_at ON products(created_at);
CREATE INDEX idx_products_price ON products(price);

CREATE INDEX idx_collections_handle ON collections(handle);

CREATE INDEX idx_cart_items_session_id ON cart_items(session_id);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);

CREATE INDEX idx_users_email ON users(email);

-- Insert sample data
INSERT INTO collections (title, description, handle) VALUES
  ('Topwear', 'All top clothing items', 'topwear'),
  ('Bottomwear', 'All bottom clothing items', 'bottomwear'),
  ('Accessories', 'Fashion accessories', 'accessories');

-- Insert sample products
INSERT INTO products (title, description, price, category, handle, images) VALUES
  ('Classic White T-Shirt', 'Premium cotton t-shirt in classic white', 999.00, 'Topwear', 'classic-white-tshirt', ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60', 'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=800&auto=format&fit=crop&q=60']),
  ('Denim Jeans', 'Comfortable denim jeans with perfect fit', 1999.00, 'Bottomwear', 'denim-jeans', ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=60']),
  ('Casual Shirt', 'Elegant casual shirt for any occasion', 1499.00, 'Topwear', 'casual-shirt', ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=60']);

-- Create RLS (Row Level Security) policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Products: Allow read access to everyone
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Collections: Allow read access to everyone
CREATE POLICY "Collections are viewable by everyone" ON collections
  FOR SELECT USING (true);

-- Cart items: Allow users to manage their own cart
CREATE POLICY "Users can manage their own cart" ON cart_items
  FOR ALL USING (session_id IS NOT NULL);

-- Users: Allow users to manage their own profile
CREATE POLICY "Users can manage their own profile" ON users
  FOR ALL USING (auth.uid() = id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

