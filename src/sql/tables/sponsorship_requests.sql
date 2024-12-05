-- Activation de l'extension UUID si elle n'est pas déjà activée
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Création de la table sponsorship_requests
CREATE TABLE IF NOT EXISTS public.sponsorship_requests (
    -- Informations principales
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    child_id UUID REFERENCES public.children(id),
    
    -- Informations du parrain potentiel
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    city VARCHAR(255),
    facebook_url TEXT,
    
    -- Détails de la demande
    motivation TEXT,
    is_long_term BOOLEAN DEFAULT true,
    terms_accepted BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'pending',
    
    -- Horodatage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Création des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_sponsorship_requests_status 
    ON public.sponsorship_requests(status);
CREATE INDEX IF NOT EXISTS idx_sponsorship_requests_child_id 
    ON public.sponsorship_requests(child_id);
CREATE INDEX IF NOT EXISTS idx_sponsorship_requests_created_at 
    ON public.sponsorship_requests(created_at);

-- Activation de la sécurité niveau ligne (RLS)
ALTER TABLE public.sponsorship_requests ENABLE ROW LEVEL SECURITY;

-- Création des politiques de sécurité
-- 1. Permettre aux utilisateurs publics de créer des demandes
CREATE POLICY "Public users can create sponsorship requests"
    ON public.sponsorship_requests FOR INSERT
    TO public
    WITH CHECK (true);

-- 2. Permettre aux utilisateurs authentifiés de voir les demandes
CREATE POLICY "Authenticated users can view sponsorship requests"
    ON public.sponsorship_requests FOR SELECT
    TO authenticated
    USING (true);

-- 3. Permettre uniquement aux administrateurs de mettre à jour les demandes
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

-- Fonction pour mettre à jour automatiquement le champ updated_at
CREATE OR REPLACE FUNCTION update_sponsorship_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Création du trigger pour la mise à jour automatique
CREATE TRIGGER update_sponsorship_requests_updated_at
    BEFORE UPDATE ON public.sponsorship_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_sponsorship_requests_updated_at();

-- Documentation des colonnes
COMMENT ON TABLE public.sponsorship_requests IS 'Table stockant les demandes de parrainage';
COMMENT ON COLUMN public.sponsorship_requests.id IS 'Identifiant unique de la demande';
COMMENT ON COLUMN public.sponsorship_requests.child_id IS 'Référence vers l''enfant concerné';
COMMENT ON COLUMN public.sponsorship_requests.full_name IS 'Nom complet du parrain potentiel';
COMMENT ON COLUMN public.sponsorship_requests.email IS 'Adresse email du parrain';
COMMENT ON COLUMN public.sponsorship_requests.phone IS 'Numéro de téléphone';
COMMENT ON COLUMN public.sponsorship_requests.facebook_url IS 'URL du profil Facebook';
COMMENT ON COLUMN public.sponsorship_requests.motivation IS 'Texte de motivation';
COMMENT ON COLUMN public.sponsorship_requests.city IS 'Ville de résidence';
COMMENT ON COLUMN public.sponsorship_requests.is_long_term IS 'Si vrai, demande de parrainage à long terme';
COMMENT ON COLUMN public.sponsorship_requests.terms_accepted IS 'Acceptation des conditions';
COMMENT ON COLUMN public.sponsorship_requests.status IS 'Statut: pending, approved, rejected';
COMMENT ON COLUMN public.sponsorship_requests.created_at IS 'Date de création';
COMMENT ON COLUMN public.sponsorship_requests.updated_at IS 'Date de dernière modification';