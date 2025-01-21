import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/Auth/AuthProvider";

interface SponsorshipButtonProps {
  childId: string;
}

export const SponsorshipButton = ({ childId }: SponsorshipButtonProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSponsorshipRequest = async () => {
    if (!user?.id) {
      navigate(`/become-sponsor?child=${childId}`);
      return;
    }

    try {
      // Vérifier si l'enfant est déjà parrainé
      const { data: child, error: childError } = await supabase
        .from('children')
        .select('is_sponsored, name')
        .eq('id', childId)
        .maybeSingle();

      if (childError) {
        console.error('Erreur lors de la vérification du statut de l\'enfant:', childError);
        toast.error("Une erreur est survenue lors de la vérification du statut de l'enfant");
        return;
      }

      if (!child) {
        toast.error("Impossible de trouver les informations de l'enfant");
        return;
      }

      if (child.is_sponsored) {
        toast.error("Cet enfant est déjà parrainé");
        return;
      }

      // Vérifier si une demande existe déjà
      const { data: existingRequest, error: requestError } = await supabase
        .from('sponsorship_requests')
        .select('status')
        .eq('child_id', childId)
        .eq('sponsor_id', user.id)
        .maybeSingle();

      if (requestError) {
        console.error('Erreur lors de la vérification des demandes existantes:', requestError);
        toast.error("Une erreur est survenue lors de la vérification des demandes existantes");
        return;
      }

      if (existingRequest) {
        if (existingRequest.status === 'pending') {
          toast.error("Vous avez déjà une demande de parrainage en cours pour cet enfant");
        } else {
          toast.error("Vous avez déjà parrainé cet enfant");
        }
        return;
      }

      // Créer la demande de parrainage
      const { error: createError } = await supabase
        .from('sponsorship_requests')
        .insert({
          child_id: childId,
          sponsor_id: user.id,
          status: 'pending',
          is_long_term: true,
          terms_accepted: true,
          full_name: user.name,
          email: user.email,
          city: user.city
        });

      if (createError) {
        console.error('Erreur lors de la création de la demande:', createError);
        toast.error("Une erreur est survenue lors de la demande de parrainage");
        return;
      }

      toast.success("Votre demande de parrainage a été envoyée avec succès");
      
    } catch (error) {
      console.error('Erreur lors de la demande de parrainage:', error);
      toast.error("Une erreur est survenue lors de la demande de parrainage");
    }
  };

  return (
    <Button 
      onClick={handleSponsorshipRequest}
      size="lg"
      className="w-full md:w-auto"
    >
      Parrainer cet enfant
    </Button>
  );
};