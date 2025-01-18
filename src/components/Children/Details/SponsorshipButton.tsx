import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SponsorshipButtonProps {
  childId: string;
  userId: string | undefined;
}

export const SponsorshipButton = ({ childId, userId }: SponsorshipButtonProps) => {
  const navigate = useNavigate();

  const handleSponsorshipRequest = async () => {
    if (!userId) {
      navigate(`/become-sponsor?child=${childId}`);
      return;
    }

    try {
      const { data: existingSponsorship, error: sponsorshipError } = await supabase
        .from('sponsorships')
        .select('*')
        .eq('sponsor_id', userId)
        .eq('status', 'active')
        .maybeSingle();

      if (sponsorshipError) throw sponsorshipError;

      if (!existingSponsorship) {
        navigate(`/become-sponsor?child=${childId}`);
        return;
      }

      const { error: requestError } = await supabase
        .from('sponsorship_requests')
        .insert({
          child_id: childId,
          sponsor_id: userId,
          status: 'pending',
          is_long_term: true,
          terms_accepted: true
        });

      if (requestError) throw requestError;

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