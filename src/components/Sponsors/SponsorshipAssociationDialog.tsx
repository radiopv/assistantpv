import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (isOpen) {
      fetchAvailableChildren();
    }
  }, [isOpen]);

  const fetchAvailableChildren = async () => {
    try {
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("status", "available")
        .eq("is_sponsored", false);

      if (error) throw error;
      setAvailableChildren(data || []);
    } catch (error) {
      console.error("Error fetching children:", error);
      toast.error(t("errorFetchingChildren"));
    }
  };

  const handleAddChild = async () => {
    if (!selectedChild) {
      toast.error(t("selectChildFirst"));
      return;
    }

    try {
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

      if (sponsorshipError) throw sponsorshipError;

      // Update child status
      const { error: childUpdateError } = await supabase
        .from("children")
        .update({
          is_sponsored: true,
          status: "sponsored",
          sponsor_id: sponsor.id,
        })
        .eq("id", selectedChild.id);

      if (childUpdateError) throw childUpdateError;

      toast.success(t("sponsorshipCreated"));
      onClose();
    } catch (error) {
      console.error("Error creating sponsorship:", error);
      toast.error(t("errorCreatingSponsorship"));
    }
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