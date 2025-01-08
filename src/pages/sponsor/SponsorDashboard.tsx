import { useAuth } from "@/components/Auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { AlbumMediaGrid } from "@/components/AlbumMedia/AlbumMediaGrid";
import { SponsoredChildCard } from "@/components/Sponsors/Dashboard/SponsoredChildCard";
import { ImportantDatesCard } from "@/components/Sponsors/Dashboard/ImportantDatesCard";
import { DashboardActions } from "@/components/Sponsors/Dashboard/DashboardActions";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const SponsorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

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
    return <div className="container mx-auto p-4">Chargement...</div>;
  }

  const sponsoredChild = sponsorships?.[0]?.children;

  if (!sponsoredChild) {
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
        <SponsoredChildCard child={sponsoredChild} />
        <ImportantDatesCard 
          birthDate={sponsoredChild.birth_date} 
          plannedVisits={plannedVisits || []} 
        />
      </div>

      <Tabs defaultValue="actions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="gallery">Album Photos</TabsTrigger>
          <TabsTrigger value="visits">Visites Prévues</TabsTrigger>
        </TabsList>

        <TabsContent value="actions" className="space-y-4">
          <DashboardActions />
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          <Card className="p-6">
            <AlbumMediaGrid childId={sponsoredChild.id} />
          </Card>
        </TabsContent>

        <TabsContent value="visits" className="space-y-4">
          <Card className="p-6">
            {plannedVisits && plannedVisits.length > 0 ? (
              <div className="space-y-4">
                {plannedVisits.map((visit) => (
                  <div key={visit.id} className="p-4 border rounded-lg">
                    <p className="font-medium">
                      {new Date(visit.start_date).toLocaleDateString()}
                    </p>
                    {visit.notes && (
                      <p className="text-gray-600 mt-2">{visit.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Aucune visite prévue</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SponsorDashboard;