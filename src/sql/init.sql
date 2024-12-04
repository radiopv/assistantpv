-- Table pour les notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient_id UUID REFERENCES public.sponsors(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table pour les messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES public.sponsors(id),
    recipient_id UUID REFERENCES public.sponsors(id),
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    is_starred BOOLEAN DEFAULT false,
    parent_id UUID REFERENCES public.messages(id),
    conversation_type TEXT,
    sender_role TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Fonction pour obtenir les besoins urgents par ville
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

-- Ajout des politiques RLS pour la sécurité
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Politique pour les notifications
CREATE POLICY "Users can view their own notifications"
    ON public.notifications
    FOR SELECT
    USING (auth.uid() = recipient_id);

-- Politiques pour les messages
CREATE POLICY "Users can view messages they sent or received"
    ON public.messages
    FOR SELECT
    USING (
        auth.uid() = sender_id OR 
        auth.uid() = recipient_id
    );

CREATE POLICY "Users can insert messages"
    ON public.messages
    FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON public.messages(is_read);