import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
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

export default function AssistantSponsorship() {
  const { toast } = useToast();
  const [searchChild, setSearchChild] = useState("");
  const [searchSponsor, setSearchSponsor] = useState("");
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [selectedSponsor, setSelectedSponsor] = useState<string | null>(null);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [currentSponsor, setCurrentSponsor] = useState<any>(null);

  const { data: children = [], isLoading: isLoadingChildren } = useQuery({
    queryKey: ["children"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("children")
        .select(`
          *,
          sponsorships (
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

  const handleTransfer = async () => {
    try {
      // End current sponsorship
      const { error: endError } = await supabase
        .from("sponsorships")
        .update({ 
          status: "ended",
          end_date: new Date().toISOString()
        })
        .eq("child_id", selectedChild)
        .eq("status", "active");

      if (endError) throw endError;

      // Create new sponsorship
      await createAssociation();
      
      setShowTransferDialog(false);

    } catch (error) {
      console.error("Error transferring sponsorship:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du transfert",
        variant: "destructive",
      });
    }
  };

  const removeAssociation = async (childId: string) => {
    try {
      const { error: sponsorshipError } = await supabase
        .from("sponsorships")
        .update({ 
          status: "ended",
          end_date: new Date().toISOString()
        })
        .eq("child_id", childId)
        .eq("status", "active");

      if (sponsorshipError) throw sponsorshipError;

      const { error: childError } = await supabase
        .from("children")
        .update({ 
          is_sponsored: false,
          sponsor_id: null,
          sponsor_name: null
        })
        .eq("id", childId);

      if (childError) throw childError;

      toast({
        title: "Succès",
        description: "Le parrainage a été retiré avec succès",
      });
      
    } catch (error) {
      console.error("Error removing association:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du retrait du parrainage",
        variant: "destructive",
      });
    }
  };

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
