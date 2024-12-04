-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    recipient_id UUID REFERENCES public.sponsors(id),
    type VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sender_id UUID REFERENCES public.sponsors(id),
    recipient_id UUID REFERENCES public.sponsors(id),
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    parent_id UUID REFERENCES public.messages(id),
    conversation_type VARCHAR(50),
    is_archived BOOLEAN DEFAULT false,
    is_starred BOOLEAN DEFAULT false,
    sender_role VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create aid_categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.aid_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create donation_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.donation_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    donation_id UUID REFERENCES public.donations(id),
    category_id UUID REFERENCES public.aid_categories(id),
    quantity INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create the donation_items_with_categories view
CREATE OR REPLACE VIEW public.donation_items_with_categories AS
SELECT 
    di.id,
    di.donation_id,
    di.category_id,
    ac.name as category_name,
    di.quantity,
    di.description
FROM 
    public.donation_items di
LEFT JOIN 
    public.aid_categories ac ON di.category_id = ac.id;

-- Add RLS policies
ALTER TABLE public.aid_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_items ENABLE ROW LEVEL SECURITY;

-- Create policies for aid_categories
CREATE POLICY "Aid categories are viewable by everyone"
    ON public.aid_categories FOR SELECT
    TO PUBLIC
    USING (true);

-- Create policies for donation_items
CREATE POLICY "Donation items are viewable by everyone"
    ON public.donation_items FOR SELECT
    TO PUBLIC
    USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_donation_items_donation_id ON public.donation_items(donation_id);
CREATE INDEX IF NOT EXISTS idx_donation_items_category_id ON public.donation_items(category_id);

-- Function to fix invalid JSON in needs column
CREATE OR REPLACE FUNCTION fix_needs_json()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update any NULL needs to empty array
    UPDATE public.children 
    SET needs = '[]'::jsonb 
    WHERE needs IS NULL;

    -- Fix any invalid JSON by converting it to proper format
    UPDATE public.children 
    SET needs = CASE 
        WHEN jsonb_typeof(needs::jsonb) = 'array' THEN needs::jsonb
        WHEN needs IS NOT NULL THEN '[]'::jsonb
        ELSE '[]'::jsonb
    END
    WHERE needs IS NOT NULL AND (
        jsonb_typeof(needs::jsonb) != 'array' 
        OR needs::text = 'null'
    );

    -- Ensure each need in the array has the correct structure
    UPDATE public.children 
    SET needs = (
        SELECT jsonb_agg(
            CASE 
                WHEN jsonb_typeof(need) = 'object' THEN
                    jsonb_build_object(
                        'category', COALESCE(need->>'category', ''),
                        'description', COALESCE(need->>'description', ''),
                        'is_urgent', COALESCE((need->>'is_urgent')::boolean, false)
                    )
                ELSE
                    jsonb_build_object(
                        'category', '',
                        'description', '',
                        'is_urgent', false
                    )
            END
        )
        FROM jsonb_array_elements(needs::jsonb) need
    )
    WHERE needs IS NOT NULL AND jsonb_typeof(needs::jsonb) = 'array';
END;
$$;

-- Function to get urgent needs by city
CREATE OR REPLACE FUNCTION public.get_urgent_needs_by_city()
RETURNS TABLE (
    city TEXT,
    urgent_needs_count BIGINT,
    total_needs BIGINT,
    urgent_needs_ratio NUMERIC
) 
LANGUAGE plpgsql
AS $$
BEGIN
    -- Call the fix function before calculating stats
    PERFORM fix_needs_json();
    
    RETURN QUERY
    WITH needs_data AS (
        SELECT 
            c.city,
            (jsonb_array_elements(c.needs::jsonb) ->> 'is_urgent')::boolean as is_urgent
        FROM public.children c
        WHERE c.needs IS NOT NULL
    )
    SELECT 
        nd.city,
        COUNT(*) FILTER (WHERE nd.is_urgent) as urgent_needs_count,
        COUNT(*) as total_needs,
        ROUND(COUNT(*) FILTER (WHERE nd.is_urgent)::numeric / NULLIF(COUNT(*), 0)::numeric * 100, 2) as urgent_needs_ratio
    FROM needs_data nd
    GROUP BY nd.city
    HAVING COUNT(*) > 0;
END;
$$;

-- Add RLS policies for security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = recipient_id::text);

-- Create policies for messages
CREATE POLICY "Users can view their own messages"
    ON public.messages FOR SELECT
    USING (auth.uid() IN (recipient_id::text, sender_id::text));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON public.messages(is_read);

-- Execute the fix function
SELECT fix_needs_json();