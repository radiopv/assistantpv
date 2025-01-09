import { useAuth } from "@/components/Auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DashboardTabs } from "@/components/Sponsors/Dashboard/DashboardTabs";
import { SponsoredChildSection } from "@/components/Sponsors/Dashboard/SponsoredChildSection";
import { toast } from "@/components/ui/use-toast";

const SponsorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: sponsorships, isLoading: sponsorshipsLoading } = useQuery({
    queryKey: ["sponsorships", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("sponsorships")
        .select(`
          id,
          sponsor_id,
          child_id,
          status,
          start_date,
          end_date,
          children (
            id,
            name,
            birth_date,
            photo_url,
            city,
            needs,
            description,
            story,
            comments,
            age,
            gender
          )
        `)
        .eq("sponsor_id", user.id)
        .eq("status", "active");

      if (error) {
        console.error("Error fetching sponsorships:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger vos parrainages"
        });
        return null;
      }

      console.log("Fetched sponsorships:", data);
      return data;
    },
    enabled: !!user?.id
  });

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-6">
          <p className="text-center">Veuillez vous connecter pour accéder à votre tableau de bord.</p>
          <Button onClick={() => navigate("/login")} className="mt-4 mx-auto block">
            Se connecter
          </Button>
        </Card>
      </div>
    );
  }

  if (sponsorshipsLoading) {
    return <div className="container mx-auto p-4">Chargement...</div>;
  }

  if (!sponsorships?.length) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Mon Espace Parrain</h1>
        <Card className="p-6">
          <p className="text-gray-600 mb-4">Vous ne parrainez pas encore d'enfant.</p>
          <Button onClick={() => navigate("/become-sponsor")}>
            Parrainer un enfant
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Mon Espace Parrain</h1>

      <DashboardTabs 
        sponsorships={sponsorships}
        userId={user.id}
        plannedVisits={[]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sponsorships.map((sponsorship) => (
          <SponsoredChildSection
            key={sponsorship.id}
            sponsorship={sponsorship}
            userId={user.id}
          />
        ))}
      </div>
    </div>
  );
};

export default SponsorDashboard;