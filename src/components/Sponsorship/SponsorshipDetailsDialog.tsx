import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sponsorship } from "@/integrations/supabase/types/sponsorship";
import { useState } from "react";
import { AddChildDialog } from "./AddChildDialog";
import { ReassignChildDialog } from "./ReassignChildDialog";

interface SponsorshipDetailsDialogProps {
  sponsor: any;
  open: boolean;
  onClose: () => void;
  onCreateSponsorship: (childId: string) => void;
  onDeleteSponsorship: (sponsorshipId: string) => void;
  onReassignChild: (childId: string, newSponsorId: string) => void;
}

export const SponsorshipDetailsDialog = ({
  sponsor,
  open,
  onClose,
  onCreateSponsorship,
  onDeleteSponsorship,
  onReassignChild
}: SponsorshipDetailsDialogProps) => {
  const { t } = useLanguage();
  const [addChildDialogOpen, setAddChildDialogOpen] = useState(false);
  const [reassignChildDialogOpen, setReassignChildDialogOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<any>(null);

  const handleAddChild = (childId: string) => {
    onCreateSponsorship(childId);
    setAddChildDialogOpen(false);
  };

  const handleReassignChild = (newSponsorId: string) => {
    if (selectedChild) {
      onReassignChild(selectedChild.id, newSponsorId);
      setReassignChildDialogOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button variant="outline">{t("sponsorship.manageSponsorChildren")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("sponsorship.manageSponsorChildren", { name: sponsor.name })}</DialogTitle>
        </DialogHeader>
        <div>
          <Button onClick={() => setAddChildDialogOpen(true)}>{t("sponsorship.addChild")}</Button>
          {/* List of sponsored children */}
          {sponsor.children.map((child: any) => (
            <div key={child.id} className="flex justify-between items-center">
              <span>{child.name}</span>
              <div>
                <Button onClick={() => {
                  setSelectedChild(child);
                  setReassignChildDialogOpen(true);
                }}>
                  {t("sponsorship.reassign")}
                </Button>
                <Button onClick={() => onDeleteSponsorship(child.sponsorshipId)}>
                  {t("sponsorship.delete")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
      <AddChildDialog
        open={addChildDialogOpen}
        onClose={() => setAddChildDialogOpen(false)}
        onAdd={handleAddChild}
        sponsorId={sponsor.id}
      />
      <ReassignChildDialog
        open={reassignChildDialogOpen}
        onClose={() => setReassignChildDialogOpen(false)}
        child={selectedChild}
        currentSponsorId={sponsor.id}
        onReassign={handleReassignChild}
      />
    </Dialog>
  );
};
