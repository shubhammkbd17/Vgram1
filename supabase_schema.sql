-- Vgram Supabase Schema setup

-- 1. ENUMS & TYPES
CREATE TYPE user_role AS ENUM ('producer', 'consumer');
CREATE TYPE order_status AS ENUM ('pending', 'accepted', 'shipping', 'delivered', 'cancelled');

-- 2. TABLES
-- Profiles Table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  phone TEXT UNIQUE,
  role user_role NOT NULL DEFAULT 'consumer',
  full_name TEXT,
  avatar_url TEXT,
  address TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Products Table
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  producer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  unit TEXT NOT NULL, -- e.g., 'kg', 'piece', 'dozen', 'litre'
  category TEXT NOT NULL, -- e.g., 'Fruits', 'Vegetables', 'Grains', 'Dairy', 'Handicrafts', 'Organic Goods'
  image_url TEXT,
  stock INTEGER DEFAULT 0 NOT NULL CHECK (stock >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Orders Table
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consumer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  producer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  status order_status DEFAULT 'pending'::order_status NOT NULL,
  delivery_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Order Items Table
CREATE TABLE public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0) -- Captured price at time of purchase
);

-- Reviews Table
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(product_id, user_id) -- One review per product per user
);

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Products policies
CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Producers can insert their own products" ON public.products
  FOR INSERT WITH CHECK (
    auth.uid() = producer_id AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'producer'::user_role
    )
  );

CREATE POLICY "Producers can update their own products" ON public.products
  FOR UPDATE USING (auth.uid() = producer_id);

CREATE POLICY "Producers can delete their own products" ON public.products
  FOR DELETE USING (auth.uid() = producer_id);

-- Orders policies
CREATE POLICY "Consumers can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = consumer_id);

CREATE POLICY "Producers can view orders received" ON public.orders
  FOR SELECT USING (auth.uid() = producer_id);

CREATE POLICY "Consumers can place orders" ON public.orders
  FOR INSERT WITH CHECK (
    auth.uid() = consumer_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'consumer'::user_role
    )
  );

CREATE POLICY "Users involved in an order can update status" ON public.orders
  FOR UPDATE USING (auth.uid() = consumer_id OR auth.uid() = producer_id);

-- Order Items policies
CREATE POLICY "Consumers can view their own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND consumer_id = auth.uid()
    )
  );

CREATE POLICY "Producers can view items of orders received" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND producer_id = auth.uid()
    )
  );

CREATE POLICY "Consumers can insert items for their own orders" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND consumer_id = auth.uid()
    )
  );

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);


-- 5. PROFILE SYNC TRIGGER & FUNCTIONS (OPTIONAL BUT RECOMMENDED)
-- Create a function to handle sync of new signup details.
-- Supabase handles Phone Auth. To ensure a profile exists when a user signs up,
-- we'llupsert profiles. But we can also handle it on the client during signup setup.
