import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DonationDialog } from "../DonationDialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface EditDonationDialogProps {
  open: boolean;
  onClose: () => void;
  donation: any;
  onSuccess: () => void;
}

export const EditDonationDialog = ({ open, onClose, donation, onSuccess }: EditDonationDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();

  const translations = {
    fr: {
      updateSuccess: "Don mis à jour avec succès",
      updateError: "Erreur lors de la mise à jour du don"
    },
    es: {
      updateSuccess: "Donación actualizada con éxito",
      updateError: "Error al actualizar la donación"
    }
  };

  const t = translations[language as keyof typeof translations];

  const handleSave = async (updatedDonation: any) => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('donations')
        .update({
          assistant_name: updatedDonation.assistant_name,
          city: updatedDonation.city,
          people_helped: updatedDonation.people_helped,
          comments: updatedDonation.comments
        })
        .eq('id', donation.id);

      if (error) throw error;

      toast({
        description: t.updateSuccess,
        variant: "default"
      });
      onSuccess();
    } catch (error) {
      toast({
        description: t.updateError,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DonationDialog
          open={open}
          onClose={onClose}
          donation={donation}
          onSave={handleSave}
        />
      </DialogContent>
    </Dialog>
  );
};