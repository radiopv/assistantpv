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

const SponsorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: sponsorships, isLoading } = useQuery({
    queryKey: ["sponsorships", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsorships")
        .select(`
          *,
          children (
            id,
            name,
            birth_date,
            photo_url,
            city
          )
        `)
        .eq("sponsor_id", user?.id)
        .eq("status", "active");

      if (error) throw error;
      return data;
    },
  });

  const { data: plannedVisits } = useQuery({
    queryKey: ["planned-visits", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("planned_visits")
        .select("*")
        .eq("sponsor_id", user?.id)
        .gte("start_date", new Date().toISOString())
        .order("start_date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  const sponsoredChild = sponsorships?.[0]?.children;

  if (!sponsoredChild) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Mon Espace Parrain</h1>
        <Card className="p-6">
          <p>Vous ne parrainez pas encore d'enfant.</p>
          <Button onClick={() => navigate("/become-sponsor")} className="mt-4">
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
        <SponsoredChildCard child={sponsoredChild} />
        <ImportantDatesCard 
          birthDate={sponsoredChild.birth_date} 
          plannedVisits={plannedVisits || []} 
        />
      </div>

      <Tabs defaultValue="actions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="gallery">Galerie Photos</TabsTrigger>
        </TabsList>

        <TabsContent value="actions" className="space-y-4">
          <DashboardActions />
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          <Card className="p-6">
            <p>Album photos à venir...</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SponsorDashboard;