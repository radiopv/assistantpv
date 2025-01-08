import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface SponsorshipAssociationDialogProps {
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
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [availableChildren, setAvailableChildren] = useState<any[]>([]);
  const { t } = useLanguage();

  const fetchAvailableChildren = async () => {
    const { data, error } = await supabase
      .from("children")
      .select("*")
      .eq("status", "available")
      .eq("is_sponsored", false);

    if (error) {
      console.error("Error fetching children:", error);
      return;
    }

    setAvailableChildren(data || []);
  };

  const handleAddChild = async () => {
    if (!selectedChild) {
      toast.error(t("selectChildFirst"));
      return;
    }

    // Check if child is already sponsored
    const { data: existingSponsorship } = await supabase
      .from("sponsorships")
      .select("*")
      .eq("child_id", selectedChild.id)
      .eq("status", "active")
      .single();

    if (existingSponsorship) {
      toast.error(t("childAlreadySponsored"));
      return;
    }

    // Create new sponsorship
    const { error: sponsorshipError } = await supabase
      .from("sponsorships")
      .insert({
        sponsor_id: sponsor.id,
        child_id: selectedChild.id,
        status: "active",
      });

    if (sponsorshipError) {
      console.error("Error creating sponsorship:", sponsorshipError);
      toast.error(t("errorCreatingSponsorship"));
      return;
    }

    // Update child status
    const { error: childUpdateError } = await supabase
      .from("children")
      .update({
        is_sponsored: true,
        status: "sponsored",
        sponsor_id: sponsor.id,
      })
      .eq("id", selectedChild.id);

    if (childUpdateError) {
      console.error("Error updating child:", childUpdateError);
      toast.error(t("errorUpdatingChild"));
      return;
    }

    toast.success(t("sponsorshipCreated"));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("addChildToSponsor", { sponsor: sponsor?.name })}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4">
            {availableChildren.map((child) => (
              <div
                key={child.id}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedChild?.id === child.id ? "border-primary" : ""
                }`}
                onClick={() => setSelectedChild(child)}
              >
                <h3 className="font-medium">{child.name}</h3>
                <p className="text-sm text-gray-500">
                  {child.age} {t("yearsOld")} - {child.city}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
              onClick={handleAddChild}
            >
              {t("addChild")}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};