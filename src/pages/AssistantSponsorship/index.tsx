import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { ChildrenList } from "@/components/AssistantSponsorship/ChildrenList";
import { SponsorsList } from "@/components/AssistantSponsorship/SponsorsList";
import { AssociationSection } from "@/components/AssistantSponsorship/AssociationSection";
import { TransferDialog } from "./TransferDialog";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

const AssistantSponsorship = () => {
  const { toast } = useToast();
  const [searchChild, setSearchChild] = useState("");
  const [searchSponsor, setSearchSponsor] = useState("");
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [selectedSponsor, setSelectedSponsor] = useState<string | null>(null);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [currentSponsor, setCurrentSponsor] = useState<any>(null);
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

      return data.map(child => ({
        ...child,
        sponsor: child.sponsorships?.[0]?.sponsor || null
      }));
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
    
    if (selectedChildData?.sponsor) {
      setCurrentSponsor(selectedChildData.sponsor);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Association Parrains-Enfants</h1>
        <LanguageToggle 
          language={language} 
          onLanguageChange={setLanguage} 
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <ChildrenList
          children={children}
          searchTerm={searchChild}
          onSearchChange={setSearchChild}
          onSelectChild={setSelectedChild}
        />

        <SponsorsList
          sponsors={sponsors}
          searchTerm={searchSponsor}
          onSearchChange={setSearchSponsor}
          onSelectSponsor={setSelectedSponsor}
        />
      </div>

      <AssociationSection
        selectedChild={selectedChild}
        selectedSponsor={selectedSponsor}
        children={children}
        sponsors={sponsors}
        onCreateAssociation={handleAssociation}
      />

      <TransferDialog
        open={showTransferDialog}
        onOpenChange={setShowTransferDialog}
        currentSponsor={currentSponsor}
        onConfirm={createAssociation}
      />
    </div>
  );
};

export default AssistantSponsorship;