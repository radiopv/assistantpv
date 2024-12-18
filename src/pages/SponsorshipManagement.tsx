import { Button } from "@/components/ui/button";
import { useSponsorshipManagement } from "@/hooks/useSponsorshipManagement";
import { Loader2, Plus, Users } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SponsorshipDetailsDialog } from "@/components/Sponsorship/SponsorshipDetailsDialog";
import { toast } from "sonner";

const SponsorshipManagement = () => {
  const { t } = useLanguage();
  const { 
    sponsorships, 
    isLoading, 
    createSponsorship, 
    deleteSponsorship,
    reassignChild 
  } = useSponsorshipManagement();
  
  const [selectedSponsor, setSelectedSponsor] = useState<any>(null);

  const handleCreateSponsorship = async (childId: string, sponsorId: string) => {
    try {
      await createSponsorship.mutateAsync(childId);
      toast.success(t("sponsorship.success.created"));
    } catch (error) {
      toast.error(t("sponsorship.error.create"));
    }
  };

  const handleDeleteSponsorship = async (sponsorshipId: string) => {
    try {
      await deleteSponsorship.mutateAsync(sponsorshipId);
      toast.success(t("sponsorship.success.deleted"));
    } catch (error) {
      toast.error(t("sponsorship.error.delete"));
    }
  };

  const handleReassignChild = async (childId: string, newSponsorId: string) => {
    try {
      await reassignChild.mutateAsync({ childId, newSponsorId });
      toast.success(t("sponsorship.success.reassigned"));
    } catch (error) {
      toast.error(t("sponsorship.error.reassign"));
    }
  };

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
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("email")}</TableHead>
              <TableHead className="text-center">{t("sponsoredChildren")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sponsorships?.map((group) => (
              <TableRow key={group.sponsor.id}>
                <TableCell className="font-medium">{group.sponsor.name}</TableCell>
                <TableCell>{group.sponsor.email}</TableCell>
                <TableCell className="text-center">{group.sponsorships.length}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSponsor(group)}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {t("manageChildren")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <SponsorshipDetailsDialog
        sponsor={selectedSponsor}
        open={!!selectedSponsor}
        onClose={() => setSelectedSponsor(null)}
        onCreateSponsorship={handleCreateSponsorship}
        onDeleteSponsorship={handleDeleteSponsorship}
        onReassignChild={handleReassignChild}
      />
    </div>
  );
};

export default SponsorshipManagement;