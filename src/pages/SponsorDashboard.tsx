import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { SponsoredChildCard } from "@/components/Sponsors/Dashboard/SponsoredChildCard";
import { ImportantDatesCard } from "@/components/Sponsors/Dashboard/ImportantDatesCard";
import { DashboardActions } from "@/components/Sponsors/Dashboard/DashboardActions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SponsorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: sponsorships, isLoading } = useQuery({
    queryKey: ["sponsorships", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      console.log("Fetching sponsorships for user:", user.id);

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
            comments,
            age,
            gender
          )
        `)
        .eq("sponsor_id", user.id)
        .eq("status", "active");

      if (error) {
        console.error("Error fetching sponsorships:", error);
        toast.error("Impossible de charger vos parrainages");
        return null;
      }

      console.log("Fetched sponsorships:", data);
      return data;
    },
    enabled: !!user?.id
  });

  const { data: plannedVisits } = useQuery({
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

  if (isLoading) {
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

      <div className="grid md:grid-cols-2 gap-6">
        {sponsorships.map((sponsorship) => (
          <SponsoredChildCard 
            key={sponsorship.id} 
            child={sponsorship.children} 
          />
        ))}
      </div>

      <Tabs defaultValue="actions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="dates">Dates Importantes</TabsTrigger>
        </TabsList>

        <TabsContent value="actions">
          <DashboardActions />
        </TabsContent>

        <TabsContent value="dates">
          <ImportantDatesCard 
            plannedVisits={plannedVisits || []}
            birthDates={sponsorships.map(s => ({
              childName: s.children.name,
              birthDate: s.children.birth_date
            }))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SponsorDashboard;