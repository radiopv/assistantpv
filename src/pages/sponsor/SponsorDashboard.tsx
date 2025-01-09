import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DashboardTabs } from "@/components/Sponsors/Dashboard/DashboardTabs";
import { SponsoredChildSection } from "@/components/Sponsors/Dashboard/SponsoredChildSection";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { AvailableChildrenList } from "@/components/AssistantSponsorship/ChildrenList";

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
          *,
          children (
            id,
            name,
            birth_date,
            photo_url,
            city,
            needs,
            description,
            story,
            comments
          )
        `)
        .eq("sponsor_id", user.id)
        .eq("status", "active");

      if (error) {
        console.error("Error fetching sponsorships:", error);
        toast.error("Impossible de charger vos parrainages");
        return null;
      }

      return data;
    },
    enabled: !!user?.id
  });

  const { data: availableChildren = [] } = useQuery({
    queryKey: ["available-children"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("is_sponsored", false)
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const { data: plannedVisits, isLoading: visitsLoading } = useQuery({
    queryKey: ["planned-visits", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("planned_visits")
        .select("*")
        .eq("sponsor_id", user.id)
        .gte("start_date", new Date().toISOString())
        .order("start_date", { ascending: true });

      if (error) {
        console.error("Error fetching planned visits:", error);
        toast.error("Impossible de charger vos visites prévues");
        return null;
      }

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

  if (sponsorshipsLoading || visitsLoading) {
    return <div className="container mx-auto p-4">Chargement...</div>;
  }

  const isNewSponsor = !sponsorships?.length;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Mon Espace Parrain</h1>

      {isNewSponsor && (
        <div className="space-y-6">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Bienvenue dans votre espace parrain !</AlertTitle>
            <AlertDescription>
              Pour commencer votre parcours de parrainage, nous vous invitons à :
              <ol className="list-decimal ml-4 mt-2 space-y-2">
                <li>Compléter votre profil avec vos informations personnelles</li>
                <li>Consulter la liste des enfants disponibles pour le parrainage</li>
                <li>Choisir un enfant à parrainer et suivre la procédure de parrainage</li>
              </ol>
            </AlertDescription>
          </Alert>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Enfants disponibles pour le parrainage</h2>
            <AvailableChildrenList
              children={availableChildren}
              searchTerm=""
              onSearchChange={() => {}}
              onSelectChild={(childId) => navigate(`/child-details/${childId}`)}
            />
          </Card>

          <Button 
            onClick={() => navigate("/settings")} 
            className="w-full md:w-auto"
          >
            Compléter mon profil
          </Button>
        </div>
      )}

      {!isNewSponsor && (
        <>
          <DashboardTabs 
            sponsorships={sponsorships || []}
            userId={user.id}
            plannedVisits={plannedVisits || []}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sponsorships?.map((sponsorship) => (
              <SponsoredChildSection
                key={sponsorship.id}
                sponsorship={sponsorship}
                userId={user.id}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SponsorDashboard;