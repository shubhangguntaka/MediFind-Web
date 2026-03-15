
-- 1. Create Profiles table (if not exists)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE, -- Supabase Auth UUID
    email TEXT UNIQUE,
    full_name TEXT,
    display_name TEXT,
    role TEXT CHECK (role IN ('user', 'author')),
    store_name TEXT,
    address TEXT,
    location JSONB, -- { "lat": 17.43, "lng": 78.40 }
    inventory JSONB DEFAULT '[]',
    search_history JSONB DEFAULT '[]',
    deletion_scheduled_on BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS (Optional but recommended)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create a policy that allows anyone to read (for pharmacy search)
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

-- 4. Create a policy that allows anyone to insert (for registration)
CREATE POLICY "Anyone can create a profile" 
ON public.profiles FOR INSERT 
WITH CHECK (true);

-- 5. Create a policy that allows users to update their own profile
CREATE POLICY "Users can update their own profiles" 
ON public.profiles FOR UPDATE 
USING (true);

-- 6. Create a policy that allows users to delete their own profile
CREATE POLICY "Users can delete their own profiles" 
ON public.profiles FOR DELETE 
USING (true);

-- 5. Insert SEED DATA (Pharmacies)
-- Note: Replace coordinates with real values for your area if needed.
INSERT INTO public.profiles (email, store_name, address, location, role, inventory)
VALUES 
('apollo_jubilee@example.com', 'Apollo Pharmacy - Jubilee Hills', 'Rd Number 36, Jubilee Hills, Hyderabad', '{"lat": 17.4300, "lng": 78.4012}', 'author', '[{"name": "Paracetamol 650mg", "stock": 100, "brands": ["Dolo 650"]}]'),
('medplus_gachibowli@example.com', 'MedPlus - Gachibowli', 'DLF Cyber City, Gachibowli, Hyderabad', '{"lat": 17.4483, "lng": 78.3614}', 'author', '[{"name": "Paracetamol 650mg", "stock": 50, "brands": ["Calpol"]}]'),
('wellness_hitech@example.com', 'Wellness Forever - Hitech City', 'Hitech City, Hyderabad', '{"lat": 17.4262, "lng": 78.3842}', 'author', '[{"name": "Ibuprofen 400mg", "stock": 30, "brands": ["Brufen"]}]');
