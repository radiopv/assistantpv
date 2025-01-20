import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SponsorFilters } from "./SponsorFilters";
import { SponsorListItem } from "./SponsorListItem";
import { SponsorshipAssociationDialog } from "./SponsorshipAssociationDialog";
import { BulkOperationsDialog } from "./SponsorshipManagement/BulkOperationsDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TooltipProvider } from "@/components/ui/tooltip";

interface SponsorsListProps {
  sponsors: any[];
  isLoading: boolean;
  onRemoveChild?: (sponsorshipId: string) => void;
}

export const SponsorsList = ({ 
  sponsors: initialSponsors, 
  isLoading,
  onRemoveChild 
}: SponsorsListProps) => {
  const [sponsors, setSponsors] = useState(initialSponsors);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");
  const [selectedSponsor, setSelectedSponsor] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSponsors, setSelectedSponsors] = useState<string[]>([]);
  const [showBulkOperations, setShowBulkOperations] = useState(false);

  const handleVerificationChange = async (sponsorId: string, checked: boolean) => {
    try {
      const { error } = await supabase
        .from('sponsors')
        .update({ is_verified: checked })
        .eq('id', sponsorId);

      if (error) throw error;
      
      setSponsors(prevSponsors =>
        prevSponsors.map(s =>
          s.id === sponsorId
            ? { ...s, is_verified: checked }
            : s
        )
      );
      toast.success("Statut de vérification mis à jour");
    } catch (error) {
      console.error('Error updating sponsor verification:', error);
      toast.error("Erreur lors de la mise à jour de la vérification");
    }
  };

  const handleStatusChange = async (sponsorId: string, field: string, value: boolean) => {
    try {
      const { error } = await supabase
        .from('sponsors')
        .update({ [field]: value })
        .eq('id', sponsorId);

      if (error) throw error;
      
      setSponsors(prevSponsors =>
        prevSponsors.map(s =>
          s.id === sponsorId
            ? { ...s, [field]: value }
            : s
        )
      );
      toast.success("Statut mis à jour avec succès");
    } catch (error) {
      console.error('Error updating sponsor status:', error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const handleSponsorUpdate = async (sponsorId: string, updatedData: any) => {
    try {
      const { error } = await supabase
        .from('sponsors')
        .update(updatedData)
        .eq('id', sponsorId);

      if (error) throw error;

      setSponsors(prevSponsors =>
        prevSponsors.map(s =>
          s.id === sponsorId
            ? { ...s, ...updatedData }
            : s
        )
      );
      toast.success("Informations du parrain mises à jour");
    } catch (error) {
      console.error('Error updating sponsor:', error);
      toast.error("Erreur lors de la mise à jour des informations");
    }
  };

  const handleAddChildClick = (sponsor: any) => {
    setSelectedSponsor(sponsor);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedSponsor(null);
    setIsDialogOpen(false);
  };

  const handleSponsorSelect = (sponsorId: string, selected: boolean) => {
    setSelectedSponsors(prev => 
      selected 
        ? [...prev, sponsorId]
        : prev.filter(id => id !== sponsorId)
    );
  };

  const handlePauseSponsorship = async (sponsorshipId: string) => {
    try {
      const { error } = await supabase.rpc('handle_sponsorship_pause', {
        sponsorship_id: sponsorshipId,
        action: 'pause',
        reason: 'Pause manuelle',
        performed_by: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) throw error;
      
      toast.success("Parrainage mis en pause");
      window.location.reload();
    } catch (error) {
      console.error('Error pausing sponsorship:', error);
      toast.error("Erreur lors de la mise en pause");
    }
  };

  const handleResumeSponsorship = async (sponsorshipId: string) => {
    try {
      const { error } = await supabase.rpc('handle_sponsorship_pause', {
        sponsorship_id: sponsorshipId,
        action: 'resume',
        reason: 'Reprise manuelle',
        performed_by: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) throw error;
      
      toast.success("Parrainage repris");
      window.location.reload();
    } catch (error) {
      console.error('Error resuming sponsorship:', error);
      toast.error("Erreur lors de la reprise");
    }
  };

  const filterAndSortSponsors = (sponsors: any[], isActive: boolean) => {
    let filtered = sponsors.filter(sponsor => {
      const searchString = `${sponsor.name} ${sponsor.email}`.toLowerCase();
      const searchTermLower = searchTerm.toLowerCase();
      return searchString.includes(searchTermLower);
    });

    return filtered.sort((a, b) => {
      if (sortOrder === "recent") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortOrder === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  };

  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="active">Parrains actifs</TabsTrigger>
        <TabsTrigger value="inactive">Parrains inactifs</TabsTrigger>
      </TabsList>

      <div className="mb-4 flex justify-between items-center">
        <SponsorFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
        {selectedSponsors.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setShowBulkOperations(true)}
          >
            Actions en masse ({selectedSponsors.length})
          </Button>
        )}
      </div>

      <TooltipProvider>
        <TabsContent value="active">
          <div className="space-y-6">
            {filterAndSortSponsors(sponsors, true).map((sponsor) => (
              <SponsorListItem
                key={sponsor.id}
                sponsor={sponsor}
                onAddChild={handleAddChildClick}
                onStatusChange={handleStatusChange}
                onVerificationChange={handleVerificationChange}
                onPauseSponsorship={handlePauseSponsorship}
                onResumeSponsorship={handleResumeSponsorship}
                onSelect={handleSponsorSelect}
                isSelected={selectedSponsors.includes(sponsor.id)}
                onUpdate={handleSponsorUpdate}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inactive">
          <div className="space-y-6">
            {filterAndSortSponsors(sponsors, false).map((sponsor) => (
              <SponsorListItem
                key={sponsor.id}
                sponsor={sponsor}
                onAddChild={handleAddChildClick}
                onStatusChange={handleStatusChange}
                onVerificationChange={handleVerificationChange}
                onSelect={handleSponsorSelect}
                isSelected={selectedSponsors.includes(sponsor.id)}
                onUpdate={handleSponsorUpdate}
              />
            ))}
          </div>
        </TabsContent>
      </TooltipProvider>

      {selectedSponsor && (
        <SponsorshipAssociationDialog
          sponsorId={selectedSponsor.id}
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
        />
      )}

      <BulkOperationsDialog
        isOpen={showBulkOperations}
        onClose={() => setShowBulkOperations(false)}
        selectedSponsors={selectedSponsors}
        onOperationComplete={() => {
          setSelectedSponsors([]);
          window.location.reload();
        }}
      />
    </Tabs>
  );
};