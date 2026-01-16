-- ============================================
-- Fix RLS Policies for Admin Access
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. DROP EXISTING RESTRICTIVE POLICIES
DROP POLICY IF EXISTS "Admin full access products" ON products;
DROP POLICY IF EXISTS "Admin full access images" ON product_images;
DROP POLICY IF EXISTS "Admin full access orders" ON orders;
DROP POLICY IF EXISTS "Admin full access order_items" ON order_items;

-- 2. RE-CREATE POLICIES WITH CORRECT EMAILS
-- Allowing both calebkiune@gmail.com AND happyhappysteps@yahoo.com for safety

-- Products
CREATE POLICY "Admin full access products" ON products 
  FOR ALL USING (
    auth.email() IN ('calebkiune@gmail.com', 'happyhappysteps@yahoo.com')
  );

-- Product Images
CREATE POLICY "Admin full access images" ON product_images 
  FOR ALL USING (
    auth.email() IN ('calebkiune@gmail.com', 'happyhappysteps@yahoo.com')
  );

-- Orders
CREATE POLICY "Admin full access orders" ON orders 
  FOR ALL USING (
    auth.email() IN ('calebkiune@gmail.com', 'happyhappysteps@yahoo.com')
  );

-- Order Items
CREATE POLICY "Admin full access order_items" ON order_items 
  FOR ALL USING (
    auth.email() IN ('calebkiune@gmail.com', 'happyhappysteps@yahoo.com')
  );
