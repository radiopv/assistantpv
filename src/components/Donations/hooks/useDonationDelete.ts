import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useDonationDelete = (onDeleteSuccess?: () => void) => {
  const { toast } = useToast();

  const handleDelete = async (donationId: string) => {
    try {
      // Supprimer les photos associées
      const { error: photosError } = await supabase
        .from('donation_photos')
        .delete()
        .eq('donation_id', donationId);

      if (photosError) throw photosError;

      // Supprimer les vidéos associées
      const { error: videosError } = await supabase
        .from('donation_videos')
        .delete()
        .eq('donation_id', donationId);

      if (videosError) throw videosError;

      // Supprimer les items du don
      const { error: itemsError } = await supabase
        .from('donation_items')
        .delete()
        .eq('donation_id', donationId);

      if (itemsError) throw itemsError;

      // Supprimer les donneurs associés
      const { error: donorsError } = await supabase
        .from('donors')
        .delete()
        .eq('donation_id', donationId);

      if (donorsError) throw donorsError;

      // Finalement, supprimer le don
      const { error: donationError } = await supabase
        .from('donations')
        .delete()
        .eq('id', donationId);

      if (donationError) throw donationError;

      toast({
        title: "Don supprimé",
        description: "Le don a été supprimé avec succès.",
      });

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error('Error deleting donation:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du don.",
      });
    }
  };

  return { handleDelete };
};