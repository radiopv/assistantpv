-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sponsorship_requests_status ON public.sponsorship_requests(status);
CREATE INDEX IF NOT EXISTS idx_sponsorship_requests_child_id ON public.sponsorship_requests(child_id);
CREATE INDEX IF NOT EXISTS idx_sponsorship_requests_created_at ON public.sponsorship_requests(created_at);

-- Enable Row Level Security
ALTER TABLE public.sponsorship_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for access control
CREATE POLICY "Public users can create sponsorship requests"
    ON public.sponsorship_requests FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Authenticated users can view sponsorship requests"
    ON public.sponsorship_requests FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admins can update sponsorship requests"
    ON public.sponsorship_requests FOR UPDATE
    TO authenticated
    USING (
        auth.uid() IN (
            SELECT id::text 
            FROM public.sponsors 
            WHERE role = 'admin'
        )
    )
    WITH CHECK (
        auth.uid() IN (
            SELECT id::text 
            FROM public.sponsors 
            WHERE role = 'admin'
        )
    );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_sponsorship_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_sponsorship_requests_updated_at
    BEFORE UPDATE ON public.sponsorship_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_sponsorship_requests_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.sponsorship_requests IS 'Stores sponsorship requests from potential sponsors';
COMMENT ON COLUMN public.sponsorship_requests.id IS 'Unique identifier for the sponsorship request';
COMMENT ON COLUMN public.sponsorship_requests.child_id IS 'Reference to the child being requested for sponsorship';
COMMENT ON COLUMN public.sponsorship_requests.full_name IS 'Full name of the potential sponsor';
COMMENT ON COLUMN public.sponsorship_requests.email IS 'Email address of the potential sponsor';
COMMENT ON COLUMN public.sponsorship_requests.phone IS 'Phone number of the potential sponsor';
COMMENT ON COLUMN public.sponsorship_requests.facebook_url IS 'Facebook profile URL of the potential sponsor';
COMMENT ON COLUMN public.sponsorship_requests.motivation IS 'Motivation text provided by the potential sponsor';
COMMENT ON COLUMN public.sponsorship_requests.city IS 'City of residence of the potential sponsor';
COMMENT ON COLUMN public.sponsorship_requests.is_long_term IS 'Whether the sponsor wants to commit to long-term sponsorship';
COMMENT ON COLUMN public.sponsorship_requests.terms_accepted IS 'Whether the sponsor has accepted the terms and conditions';
COMMENT ON COLUMN public.sponsorship_requests.status IS 'Current status of the request (pending, approved, rejected)';
COMMENT ON COLUMN public.sponsorship_requests.created_at IS 'Timestamp when the request was created';
COMMENT ON COLUMN public.sponsorship_requests.updated_at IS 'Timestamp when the request was last updated';