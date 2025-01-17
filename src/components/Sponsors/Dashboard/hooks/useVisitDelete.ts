import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useVisitDelete = (onDeleteSuccess?: () => void) => {
  const { toast } = useToast();

  const handleDelete = async (visitId: string) => {
    try {
      const { error } = await supabase
        .from('planned_visits')
        .delete()
        .eq('id', visitId);

      if (error) throw error;

      toast({
        title: "Visite supprimée",
        description: "La visite a été supprimée avec succès.",
      });

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error('Error deleting visit:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la visite.",
      });
    }
  };

  return { handleDelete };
};