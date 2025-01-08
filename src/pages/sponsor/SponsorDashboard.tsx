import { useAuth } from "@/components/Auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { convertJsonToNeeds } from "@/types/needs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SponsoredChildCard } from "@/components/Sponsors/Dashboard/SponsoredChildCard";
import { ImportantDatesCard } from "@/components/Sponsors/Dashboard/ImportantDatesCard";
import { SponsorTestimonials } from "@/components/Sponsors/Dashboard/SponsorTestimonials";
import { DashboardTabs } from "@/components/Sponsors/Dashboard/DashboardTabs";

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
            city,
            needs,
            description,
            story,
            comments
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

      {/* Tabs Section First */}
      {sponsorships.map((sponsorship) => (
        <DashboardTabs
          key={sponsorship.id}
          childId={sponsorship.children.id}
          sponsorId={user?.id || ''}
          plannedVisits={plannedVisits || []}
        />
      ))}

      {/* Child Information and Dates */}
      <div className="grid md:grid-cols-2 gap-6">
        {sponsorships.map((sponsorship) => (
          <div key={sponsorship.id} className="space-y-6">
            <SponsoredChildCard child={sponsorship.children} />
            
            {/* Description and Story Section */}
            <Card className="p-4">
              <div className="space-y-4">
                {sponsorship.children.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-600">{sponsorship.children.description}</p>
                  </div>
                )}
                
                {sponsorship.children.story && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Histoire</h3>
                    <p className="text-gray-600">{sponsorship.children.story}</p>
                  </div>
                )}
                
                {sponsorship.children.comments && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Commentaires</h3>
                    <p className="text-gray-600">{sponsorship.children.comments}</p>
                  </div>
                )}
              </div>
            </Card>
            
            {/* Needs Section */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Besoins de {sponsorship.children.name}</h3>
              <ScrollArea className="h-[200px] w-full">
                <div className="grid grid-cols-1 gap-3">
                  {convertJsonToNeeds(sponsorship.children.needs).map((need, index) => (
                    <div
                      key={`${need.category}-${index}`}
                      className={`p-3 rounded-lg ${
                        need.is_urgent
                          ? "bg-red-50 border border-red-200"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge
                            variant={need.is_urgent ? "destructive" : "secondary"}
                            className="mb-2"
                          >
                            {need.category}
                            {need.is_urgent && " (!)"} 
                          </Badge>
                          {need.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {need.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            {/* Testimonials Section */}
            <Card className="p-4">
              <SponsorTestimonials 
                sponsorId={user?.id || ''} 
                childId={sponsorship.children.id} 
              />
            </Card>
          </div>
        ))}
      </div>

      {/* Important Dates */}
      <div className="grid md:grid-cols-2 gap-6">
        {sponsorships.map((sponsorship) => (
          <ImportantDatesCard 
            key={sponsorship.id}
            birthDate={sponsorship.children.birth_date} 
            plannedVisits={plannedVisits?.filter(v => v.sponsor_id === user?.id) || []} 
          />
        ))}
      </div>
    </div>
  );
};

export default SponsorDashboard;