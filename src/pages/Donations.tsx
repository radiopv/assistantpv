import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DonationForm } from "@/components/Donations/DonationForm";
import { DonationList } from "@/components/Donations/DonationList/DonationList";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const Donations = () => {
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDeleteDonation = async (donationId: string) => {
    try {
      const { error } = await supabase
        .from("donations")
        .delete()
        .eq("id", donationId);

      if (error) throw error;

      toast({
        title: "Don supprimé",
        description: "Le don a été supprimé avec succès",
      });

      queryClient.invalidateQueries({ queryKey: ["donations-list"] });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du don",
      });
      console.error("Error deleting donation:", error);
    }
  };

  const handleEditDonation = (donationId: string) => {
    // Pour l'instant, on réutilise le formulaire existant
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dons</h1>
          <p className="text-gray-600 mt-2">Gérez les dons et leur distribution</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? "Fermer" : "Ajouter un don"}
        </Button>
      </div>

      {showForm && (
        <DonationForm
          onDonationComplete={() => {
            setShowForm(false);
            queryClient.invalidateQueries({ queryKey: ["donations-list"] });
          }}
        />
      )}

      <Card className="p-6">
        <DonationList
          onEdit={handleEditDonation}
          onDelete={handleDeleteDonation}
        />
      </Card>
    </div>
  );
};

export default Donations;
