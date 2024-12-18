import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { AddChildDialog } from "./AddChildDialog";
import { ReassignChildDialog } from "./ReassignChildDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface SponsorshipDetailsDialogProps {
  sponsor: any;
  open: boolean;
  onClose: () => void;
  onCreateSponsorship: (childId: string, sponsorId: string) => Promise<void>;
  onDeleteSponsorship: (sponsorshipId: string) => Promise<void>;
  onReassignChild: (childId: string, newSponsorId: string) => Promise<void>;
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<any>(null);

  if (!sponsor) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {t("sponsorship.manageSponsorChildren", { name: sponsor.sponsor.name })}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {t("sponsoredChildren")} ({sponsor.sponsorships.length})
            </h3>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t("addChild")}
            </Button>
          </div>

          <div className="grid gap-4">
            {sponsor.sponsorships.map((sponsorship: any) => (
              <div
                key={sponsorship.id}
                className="flex items-center justify-between p-4 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={sponsorship.child.photo_url} />
                    <AvatarFallback>{sponsorship.child.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{sponsorship.child.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {sponsorship.child.age} {t("years")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedChild(sponsorship.child)}
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    {t("reassign")}
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        {t("remove")}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("sponsorship.deleteConfirmation.title")}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("sponsorship.deleteConfirmation.description")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDeleteSponsorship(sponsorship.id)}
                        >
                          {t("confirm")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </div>

        <AddChildDialog
          open={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={(childId) => onCreateSponsorship(childId, sponsor.sponsor.id)}
          sponsorId={sponsor.sponsor.id}
        />

        <ReassignChildDialog
          open={!!selectedChild}
          onClose={() => setSelectedChild(null)}
          child={selectedChild}
          currentSponsorId={sponsor.sponsor.id}
          onReassign={(newSponsorId) => {
            if (selectedChild) {
              onReassignChild(selectedChild.id, newSponsorId);
              setSelectedChild(null);
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
};