-- Create sponsorships table
CREATE TABLE IF NOT EXISTS public.sponsorships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sponsor_id UUID REFERENCES public.sponsors(id),
    child_id UUID REFERENCES public.children(id),
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    is_anonymous BOOLEAN DEFAULT false,
    comments TEXT,
    auto_terminate_job_id UUID,
    termination_date DATE,
    termination_reason VARCHAR(255),
    termination_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sponsorships_sponsor_id ON public.sponsorships(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_sponsorships_child_id ON public.sponsorships(child_id);
CREATE INDEX IF NOT EXISTS idx_sponsorships_status ON public.sponsorships(status);

-- Add RLS policies
ALTER TABLE public.sponsorships ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view sponsorships
CREATE POLICY "Allow authenticated to view sponsorships"
ON public.sponsorships FOR SELECT
TO authenticated
USING (true);

-- Allow admins to manage sponsorships
CREATE POLICY "Allow admins to manage sponsorships"
ON public.sponsorships FOR ALL
TO authenticated
USING (auth.uid() IN (
    SELECT id::text FROM public.sponsors WHERE role = 'admin'
))
WITH CHECK (auth.uid() IN (
    SELECT id::text FROM public.sponsors WHERE role = 'admin'
));