import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AssociationSection } from "@/components/AssistantSponsorship/AssociationSection";
import { AssociationHeader } from "./AssociationHeader";
import { AssociationGrid } from "./AssociationGrid";
import { TransferConfirmationDialog } from "./TransferConfirmationDialog";

interface Sponsor {
  id: string;
  name: string;
}

interface Sponsorship {
  id: string;
  sponsor: Sponsor;
}

interface Child {
  id: string;
  name: string;
  age: number;
  birth_date: string;
  city: string;
  comments: string;
  created_at: string;
  description: string;
  end_date: string;
  gender: string;
  is_sponsored: boolean;
  location_id: number;
  photo_url: string | null;
  sponsor_id: string | null;
  sponsor_name: string | null;
  sponsorships: Sponsorship[];
}

const AssistantSponsorship = () => {
  const { toast } = useToast();
  const [searchChild, setSearchChild] = useState("");
  const [searchSponsor, setSearchSponsor] = useState("");
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [selectedSponsor, setSelectedSponsor] = useState<string | null>(null);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [currentSponsor, setCurrentSponsor] = useState<Sponsor | null>(null);
  const { language, setLanguage } = useLanguage();

  const { data: children = [], isLoading: isLoadingChildren } = useQuery({
    queryKey: ["children"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("children")
        .select(`
          *,
          sponsorships (
            id,
            sponsor:sponsors (
              id,
              name
            )
          )
        `);

      if (error) throw error;
      return data as Child[];
    },
  });

  const { data: sponsors = [], isLoading: isLoadingSponsors } = useQuery({
    queryKey: ["sponsors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsors")
        .select("*")
        .eq("role", "sponsor");

      if (error) throw error;
      return data;
    },
  });

  const handleRemoveSponsorship = async (childId: string): Promise<void> => {
    try {
      const { error: sponsorshipError } = await supabase
        .from("sponsorships")
        .delete()
        .eq("child_id", childId);

      if (sponsorshipError) throw sponsorshipError;

      toast({
        title: "Succès",
        description: "Le parrainage a été supprimé avec succès",
      });

    } catch (error) {
      console.error("Error removing sponsorship:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du parrainage",
        variant: "destructive",
      });
    }
  };

  const handleAssociation = async () => {
    if (!selectedChild || !selectedSponsor) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un enfant et un parrain",
        variant: "destructive",
      });
      return;
    }

    const selectedChildData = children.find((c) => c.id === selectedChild);
    
    if (selectedChildData?.sponsorships[0]?.sponsor) {
      setCurrentSponsor(selectedChildData.sponsorships[0].sponsor);
      setShowTransferDialog(true);
      return;
    }

    await createAssociation();
  };

  const createAssociation = async () => {
    try {
      const { error: sponsorshipError } = await supabase
        .from("sponsorships")
        .insert({
          sponsor_id: selectedSponsor,
          child_id: selectedChild,
          status: "active",
        });

      if (sponsorshipError) throw sponsorshipError;

      const { error: childError } = await supabase
        .from("children")
        .update({ 
          is_sponsored: true,
          sponsor_id: selectedSponsor,
          sponsor_name: sponsors.find(s => s.id === selectedSponsor)?.name
        })
        .eq("id", selectedChild);

      if (childError) throw childError;

      toast({
        title: "Succès",
        description: "L'association a été créée avec succès",
      });

      setSelectedChild(null);
      setSelectedSponsor(null);
      
    } catch (error) {
      console.error("Error creating association:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'association",
        variant: "destructive",
      });
    }
  };

  if (isLoadingChildren || isLoadingSponsors) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <AssociationHeader 
        onLanguageChange={() => setLanguage(language === 'fr' ? 'es' : 'fr')} 
      />

      <AssociationGrid
        children={children}
        sponsors={sponsors}
        searchChild={searchChild}
        searchSponsor={searchSponsor}
        onSearchChildChange={setSearchChild}
        onSearchSponsorChange={setSearchSponsor}
        onSelectChild={setSelectedChild}
        onSelectSponsor={setSelectedSponsor}
        onRemoveSponsorship={handleRemoveSponsorship}
      />

      <AssociationSection
        selectedChild={selectedChild}
        selectedSponsor={selectedSponsor}
        children={children}
        sponsors={sponsors}
        onCreateAssociation={handleAssociation}
      />

      <TransferConfirmationDialog
        showDialog={showTransferDialog}
        onClose={() => setShowTransferDialog(false)}
        onConfirm={createAssociation}
        currentSponsorName={currentSponsor?.name}
      />
    </div>
  );
};

export default AssistantSponsorship;