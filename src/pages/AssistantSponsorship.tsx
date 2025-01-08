import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ChildSelector } from "@/components/AssistantPhotos/ChildSelector";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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

export default function AssistantSponsorship() {
  const { toast } = useToast();
  const [searchChild, setSearchChild] = useState("");
  const [searchSponsor, setSearchSponsor] = useState("");
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [selectedSponsor, setSelectedSponsor] = useState<string | null>(null);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [currentSponsor, setCurrentSponsor] = useState<any>(null);

  // Fetch children with their sponsorship information
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

      // Transform the data to match the expected format
      return data.map(child => ({
        ...child,
        sponsor: child.sponsorships?.[0]?.sponsor || null
      }));
    },
  });

  // Fetch sponsors
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

  // Filter children based on search
  const filteredChildren = children.filter((child) =>
    child.name.toLowerCase().includes(searchChild.toLowerCase())
  );

  // Filter sponsors based on search
  const filteredSponsors = sponsors.filter((sponsor) =>
    sponsor.name.toLowerCase().includes(searchSponsor.toLowerCase())
  );

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
        {/* Section Enfants */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Enfants</h2>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Rechercher un enfant..."
              value={searchChild}
              onChange={(e) => setSearchChild(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredChildren.map((child) => (
              <div
                key={child.id}
                className="p-4 border rounded-lg hover:bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{child.name}</p>
                  <p className="text-sm text-gray-600">
                    {child.sponsor
                      ? `Parrainé par ${child.sponsor.name}`
                      : "Non parrainé"}
                  </p>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedChild(child.id)}
                  >
                    Sélectionner
                  </Button>
                  {child.sponsor && (
                    <Button
                      variant="destructive"
                      onClick={() => removeAssociation(child.id)}
                    >
                      Retirer
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Parrains */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Parrains</h2>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Rechercher un parrain..."
              value={searchSponsor}
              onChange={(e) => setSearchSponsor(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredSponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className="p-4 border rounded-lg hover:bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{sponsor.name}</p>
                  <p className="text-sm text-gray-600">{sponsor.email}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedSponsor(sponsor.id)}
                >
                  Sélectionner
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Association */}
      <div className="mt-8 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">Créer une association</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="mb-2">Enfant sélectionné:</p>
            <p className="font-medium">
              {selectedChild
                ? children.find((c) => c.id === selectedChild)?.name
                : "Aucun enfant sélectionné"}
            </p>
          </div>
          <div>
            <p className="mb-2">Parrain sélectionné:</p>
            <p className="font-medium">
              {selectedSponsor
                ? sponsors.find((s) => s.id === selectedSponsor)?.name
                : "Aucun parrain sélectionné"}
            </p>
          </div>
        </div>
        <Button
          className="mt-4 w-full md:w-auto"
          onClick={handleAssociation}
          disabled={!selectedChild || !selectedSponsor}
        >
          Créer l'association
        </Button>
      </div>

      {/* Dialog de transfert */}
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