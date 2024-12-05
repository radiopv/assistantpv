import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useDonationEdit = () => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();

  const handleSaveEdit = async (editedDonation: any) => {
    try {
      const { error } = await supabase
        .from('donations')
        .update({
          city: editedDonation.city,
          people_helped: editedDonation.people_helped,
          assistant_name: editedDonation.assistant_name,
          comments: editedDonation.comments,
          status: editedDonation.status
        })
        .eq('id', editedDonation.id);

      if (error) throw error;

      toast({
        title: "Don modifié",
        description: "Les modifications ont été enregistrées avec succès.",
      });

      setShowEditDialog(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du don.",
      });
    }
  };

  return {
    showEditDialog,
    setShowEditDialog,
    handleSaveEdit
  };
};