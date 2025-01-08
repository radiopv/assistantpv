import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SponsorshipAssociationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  childId: string;
  sponsorId: string;
  onAssociate: () => void;
}

export const SponsorshipAssociationDialog = ({
  isOpen,
  onClose,
  childId,
  sponsorId,
  onAssociate
}: SponsorshipAssociationDialogProps) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const handleAssociate = async () => {
    try {
      setIsLoading(true);

      // Create sponsorship
      const { error: sponsorshipError } = await supabase
        .from('sponsorships')
        .insert([
          {
            child_id: childId,
            sponsor_id: sponsorId,
            status: 'active'
          }
        ]);

      if (sponsorshipError) {
        throw sponsorshipError;
      }

      // Update child status
      const { error: childError } = await supabase
        .from('children')
        .update({ is_sponsored: true })
        .eq('id', childId);

      if (childError) {
        throw childError;
      }

      toast.success(t("sponsorshipCreated"));
      onAssociate();
      onClose();
    } catch (error) {
      console.error('Error creating sponsorship:', error);
      toast.error(t("errorCreatingSponsorship"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("confirmAssociation")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{t("confirmAssociationText")}</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              {t("cancel")}
            </Button>
            <Button onClick={handleAssociate} disabled={isLoading}>
              {t("confirm")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SponsorshipAssociationDialog;