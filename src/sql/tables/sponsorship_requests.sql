-- Create sponsorship_requests table
CREATE TABLE IF NOT EXISTS public.sponsorship_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    child_id UUID REFERENCES public.children(id),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    facebook_url TEXT,
    motivation TEXT,
    city VARCHAR(255),
    is_long_term BOOLEAN DEFAULT true,
    terms_accepted BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add RLS policies
ALTER TABLE public.sponsorship_requests ENABLE ROW LEVEL SECURITY;

-- Allow public to insert new requests
CREATE POLICY "Allow public to insert requests"
ON public.sponsorship_requests FOR INSERT
TO public
WITH CHECK (true);

-- Allow authenticated users to view requests
CREATE POLICY "Allow authenticated to view requests"
ON public.sponsorship_requests FOR SELECT
TO authenticated
USING (true);

-- Allow admins to update requests
CREATE POLICY "Allow admins to update requests"
ON public.sponsorship_requests FOR UPDATE
TO authenticated
USING (auth.uid() IN (
    SELECT id::text FROM public.sponsors WHERE role = 'admin'
))
WITH CHECK (auth.uid() IN (
    SELECT id::text FROM public.sponsors WHERE role = 'admin'
));