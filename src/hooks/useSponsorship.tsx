import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useSponsorship() {
  const { toast } = useToast();
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [selectedSponsor, setSelectedSponsor] = useState<string | null>(null);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [currentSponsor, setCurrentSponsor] = useState<any>(null);

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

  return {
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
  };
}