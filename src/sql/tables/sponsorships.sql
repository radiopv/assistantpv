CREATE TABLE IF NOT EXISTS public.sponsorships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    child_id UUID REFERENCES public.children(id),
    sponsor_id UUID REFERENCES public.sponsors(id),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    end_date TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sponsorships_child_id ON public.sponsorships(child_id);
CREATE INDEX IF NOT EXISTS idx_sponsorships_sponsor_id ON public.sponsorships(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_sponsorships_status ON public.sponsorships(status);

-- Enable RLS
ALTER TABLE public.sponsorships ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Sponsorships are viewable by everyone"
    ON public.sponsorships FOR SELECT
    TO PUBLIC
    USING (true);