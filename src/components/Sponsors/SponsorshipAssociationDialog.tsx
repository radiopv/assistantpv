import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SponsorshipAssociationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sponsor: {
    id: string;
    name: string;
  };
}

export const SponsorshipAssociationDialog = ({
  isOpen,
  onClose,
  sponsor,
}: SponsorshipAssociationDialogProps) => {
  const [availableChildren, setAvailableChildren] = useState([]);
  const { t } = useLanguage();

  const handleAssociateChild = async (childId: string) => {
    try {
      // Create sponsorship
      const { error: sponsorshipError } = await supabase
        .from("sponsorships")
        .insert({
          sponsor_id: sponsor.id,
          child_id: childId,
          status: "active",
        });

      if (sponsorshipError) throw sponsorshipError;

      // Update child status
      const { error: childError } = await supabase
        .from("children")
        .update({
          is_sponsored: true,
          sponsor_id: sponsor.id,
        })
        .eq("id", childId);

      if (childError) throw childError;

      toast.success(t("childAssociatedSuccessfully"));
      onClose();
    } catch (error) {
      console.error("Error associating child:", error);
      toast.error(t("errorAssociatingChild"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("associateChildWith", { sponsorName: sponsor.name })}</DialogTitle>
        </DialogHeader>
        <div>
          <h2>{t("availableChildren")}</h2>
          <ul>
            {availableChildren.map((child) => (
              <li key={child.id}>
                <span>{child.name}</span>
                <button onClick={() => handleAssociateChild(child.id)}>
                  {t("associate")}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};