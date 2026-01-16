-- ============================================
-- Happy Happy Feet - Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. PRODUCTS TABLE
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  category TEXT NOT NULL, -- Flexible category text
  sizes TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_slug ON products(slug);

-- 2. PRODUCT IMAGES TABLE
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_product_images_product ON product_images(product_id);

-- 3. ORDERS TABLE
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  notes TEXT,
  total INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- 4. ORDER ITEMS TABLE
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_purchase INTEGER NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products: Public read, Admin full access
CREATE POLICY "Public read products" ON products 
  FOR SELECT USING (true);

CREATE POLICY "Admin full access products" ON products 
  FOR ALL USING (auth.email() IN ('calebkiune@gmail.com', 'happyhappysteps@yahoo.com'));

-- Product Images: Public read, Admin full access
CREATE POLICY "Public read images" ON product_images 
  FOR SELECT USING (true);

CREATE POLICY "Admin full access images" ON product_images 
  FOR ALL USING (auth.email() IN ('calebkiune@gmail.com', 'happyhappysteps@yahoo.com'));

-- Orders: Admin only (no public access)
CREATE POLICY "Admin full access orders" ON orders 
  FOR ALL USING (auth.email() IN ('calebkiune@gmail.com', 'happyhappysteps@yahoo.com'));

-- Order Items: Admin only
CREATE POLICY "Admin full access order_items" ON order_items 
  FOR ALL USING (auth.email() IN ('calebkiune@gmail.com', 'happyhappysteps@yahoo.com'));

-- ============================================
-- DONE! Now run the migration script.
-- ============================================
