import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChildrenList } from "@/components/AssistantSponsorship/ChildrenList";
import { SponsorsList } from "@/components/AssistantSponsorship/SponsorsList";
import { AssociationSection } from "@/components/AssistantSponsorship/AssociationSection";
import { useSponsorship } from "@/hooks/useSponsorship.tsx"; // Fixed import path with .tsx extension

export default function AssistantSponsorship() {
  const [searchChild, setSearchChild] = useState("");
  const [searchSponsor, setSearchSponsor] = useState("");
  
  const {
    selectedChild,
    setSelectedChild,
    selectedSponsor,
    setSelectedSponsor,
    showTransferDialog,
    setShowTransferDialog,
    currentSponsor,
    handleAssociation,
    handleTransfer,
    removeAssociation
  } = useSponsorship();

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

  if (isLoadingChildren || isLoadingSponsors) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Association Parrains-Enfants</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <ChildrenList
          children={children}
          searchTerm={searchChild}
          onSearchChange={setSearchChild}
          onSelectChild={setSelectedChild}
          onRemoveSponsorship={removeAssociation}
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

      <AlertDialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer le transfert</AlertDialogTitle>
            <AlertDialogDescription>
              Cet enfant est déjà parrainé par {currentSponsor?.name}. 
              Souhaitez-vous transférer cet enfant à un autre parrain ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleTransfer}>
              Confirmer le transfert
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}