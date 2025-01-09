import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DashboardTabs } from "@/components/Sponsors/Dashboard/DashboardTabs";
import { SponsoredChildSection } from "@/components/Sponsors/Dashboard/SponsoredChildSection";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { ChildrenList } from "@/components/AssistantSponsorship/ChildrenList";
import { UserProfileMenu } from "@/components/Layout/UserProfileMenu";
import { useLanguage } from "@/contexts/LanguageContext";

const SponsorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

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

  const { data: pendingRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ["sponsorship-requests", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("sponsorship_requests")
        .select(`
          *,
          children (
            name,
            photo_url,
            age,
            city
          )
        `)
        .eq("email", user.email)
        .eq("status", "pending");

      if (error) {
        console.error("Error fetching requests:", error);
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

  if (sponsorshipsLoading || visitsLoading || requestsLoading) {
    return <div className="container mx-auto p-4">Chargement...</div>;
  }

  const isNewSponsor = !sponsorships?.length;
  const hasPendingRequests = pendingRequests && pendingRequests.length > 0;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mon Espace Parrain</h1>
        <UserProfileMenu />
      </div>

      {hasPendingRequests && (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription className="space-y-4">
            <div className="font-semibold">Votre demande de parrainage est en cours d'examen</div>
            <p>
              Nous avons bien reçu votre demande de parrainage et elle est actuellement en cours d'examen par notre équipe.
              Vous recevrez une notification dès qu'elle sera approuvée.
            </p>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Informations importantes sur le parrainage :</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Le parrainage est un engagement à long terme pour soutenir un enfant dans son développement</li>
                <li>Vous recevrez régulièrement des nouvelles et des photos de l'enfant que vous parrainez</li>
                <li>Vous pouvez communiquer avec l'enfant via notre plateforme</li>
                <li>Votre soutien aide à fournir une éducation, des soins de santé et un meilleur avenir à l'enfant</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {isNewSponsor && !hasPendingRequests && (
        <div className="space-y-6">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <div className="font-semibold">Bienvenue dans votre espace parrain !</div>
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
            <ChildrenList
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