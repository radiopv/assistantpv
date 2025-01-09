import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SponsorFilters } from "./SponsorFilters";
import { SponsorListItem } from "./SponsorListItem";
import { SponsorshipAssociationDialog } from "./SponsorshipAssociationDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

  const handleAddChildClick = (sponsor: any) => {
    setSelectedSponsor(sponsor);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedSponsor(null);
    setIsDialogOpen(false);
  };

  const filterAndSortSponsors = (sponsors: any[], isActive: boolean) => {
    let filtered = sponsors.filter(sponsor => {
      const searchString = `${sponsor.name} ${sponsor.email}`.toLowerCase();
      const searchTermLower = searchTerm.toLowerCase();
      
      // Filter unique active sponsorships
      const uniqueActiveSponsorships = sponsor.sponsorships?.filter((s: any) => 
        s.status === 'active' && s.children
      ).reduce((acc: any[], current: any) => {
        const exists = acc.find((s: any) => s.child_id === current.child_id);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);

      const hasActiveChildren = uniqueActiveSponsorships?.length > 0;
      return searchString.includes(searchTermLower) && 
             (isActive ? hasActiveChildren : !hasActiveChildren);
    });

    return filtered.sort((a, b) => {
      if (sortOrder === "recent") {
        const latestA = Math.max(...(a.sponsorships?.map((s: any) => new Date(s.start_date).getTime()) || [0]));
        const latestB = Math.max(...(b.sponsorships?.map((s: any) => new Date(s.start_date).getTime()) || [0]));
        return latestB - latestA;
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

      <SponsorFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      <TabsContent value="active">
        <div className="space-y-6">
          {filterAndSortSponsors(sponsors, true).map((sponsor) => (
            <SponsorListItem
              key={sponsor.id}
              sponsor={{
                ...sponsor,
                sponsorships: sponsor.sponsorships?.filter((s: any) => 
                  s.status === 'active' && s.children
                ).reduce((acc: any[], current: any) => {
                  const exists = acc.find((s: any) => s.child_id === current.child_id);
                  if (!exists) {
                    acc.push(current);
                  }
                  return acc;
                }, [])
              }}
              onAddChild={handleAddChildClick}
              onStatusChange={handleStatusChange}
              onVerificationChange={handleVerificationChange}
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
            />
          ))}
        </div>
      </TabsContent>

      {selectedSponsor && (
        <SponsorshipAssociationDialog
          sponsorId={selectedSponsor.id}
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
        />
      )}
    </Tabs>
  );
};