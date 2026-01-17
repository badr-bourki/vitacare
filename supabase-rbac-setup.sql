-- ============================================
-- VitaCare RBAC (Role-Based Access Control) Setup
-- ============================================
-- Run this SQL in your Supabase SQL Editor AFTER running supabase-setup.sql
-- This creates the roles table and sets up role management

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id) -- Each user can only have one role
);

-- Enable Row Level Security
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running this script)
DROP POLICY IF EXISTS "Users can view their own role" ON roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON roles;

-- Create RLS policies
-- Policy: Users can view their own role
CREATE POLICY "Users can view their own role"
  ON roles FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Admins can view all roles (we'll implement this later)
-- For now, users can only see their own role

-- Drop existing function and trigger if they exist
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_role();

-- Create function to automatically assign 'user' role to new signups
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.roles (user_id, role, created_at, updated_at)
  VALUES (
    NEW.id,
    'user', -- Default role for new users
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function when a new user is created
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- ============================================
-- Helper Functions
-- ============================================

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role
  FROM public.roles
  WHERE user_id = p_user_id;
  
  RETURN COALESCE(v_role, 'user'); -- Default to 'user' if no role found
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT role = 'admin' FROM public.roles WHERE user_id = p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Seed Data (Optional)
-- ============================================
-- Uncomment the following to create an admin user
-- Replace 'YOUR_USER_ID' with an actual user ID from auth.users

-- INSERT INTO public.roles (user_id, role)
-- VALUES ('YOUR_USER_ID', 'admin')
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- ============================================
-- Verification Queries
-- ============================================

-- Check if roles table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'roles'
);

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'roles';

-- Check trigger exists
SELECT * FROM information_schema.triggers 
WHERE event_object_table = 'users' 
AND trigger_name = 'on_auth_user_created_role';

-- View all roles (run as admin)
-- SELECT r.*, u.email 
-- FROM roles r
-- JOIN auth.users u ON r.user_id = u.id;
