import { Button } from "@/components/ui/button";
import { useSponsorshipManagement } from "@/hooks/useSponsorshipManagement";
import { Loader2, Plus } from "lucide-react";
import { SponsorshipList } from "@/components/Sponsorship/SponsorshipList";
import { AddSponsorshipDialog } from "@/components/Sponsorship/AddSponsorshipDialog";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const SponsorshipManagement = () => {
  const { t } = useLanguage();
  const { sponsorships, allChildren, isLoading, createSponsorship, deleteSponsorship } = useSponsorshipManagement();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("sponsorship.management")}</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t("sponsorship.newSponsorship")}
        </Button>
      </div>

      <SponsorshipList 
        sponsorships={sponsorships || []}
        onDelete={deleteSponsorship}
      />

      <AddSponsorshipDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        availableChildren={allChildren || []}
        onAdd={createSponsorship}
      />
    </div>
  );
};

export default SponsorshipManagement;