import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useChildAssignmentRequests = (sponsorId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const requestChildAssignment = async (childName: string, notes?: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('child_assignment_requests')
        .insert({
          sponsor_id: sponsorId,
          notes: `Demande d'ajout pour l'enfant: ${childName}${notes ? `\nNotes: ${notes}` : ''}`
        });

      if (error) throw error;

      toast({
        title: "Demande envoyée",
        description: "Votre demande d'ajout d'enfant a été soumise avec succès.",
      });
    } catch (error) {
      console.error('Error requesting child assignment:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission de votre demande.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const requestChildRemoval = async (childId: string, notes?: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('child_assignment_requests')
        .insert({
          sponsor_id: sponsorId,
          child_id: childId,
          notes: `Demande de retrait${notes ? `\nRaison: ${notes}` : ''}`
        });

      if (error) throw error;

      toast({
        title: "Demande envoyée",
        description: "Votre demande de retrait d'enfant a été soumise avec succès.",
      });
    } catch (error) {
      console.error('Error requesting child removal:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission de votre demande.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    requestChildAssignment,
    requestChildRemoval
  };
};