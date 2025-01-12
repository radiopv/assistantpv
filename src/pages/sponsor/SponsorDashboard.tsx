import { useAuth } from "@/components/Auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DashboardActions } from "@/components/Sponsors/Dashboard/DashboardActions";
import { SponsoredChildSection } from "@/components/Sponsors/Dashboard/SponsoredChildSection";
import { toast } from "@/components/ui/use-toast";
import { ImportantDatesCard } from "@/components/Sponsors/Dashboard/ImportantDatesCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image, MessageSquare, Calendar, Album } from "lucide-react";

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
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-none shadow-lg">
          <p className="text-gray-600 mb-4">Vous ne parrainez pas encore d'enfant.</p>
          <Button onClick={() => navigate("/become-sponsor")} className="bg-cuba-turquoise hover:bg-cuba-turquoise/90">
            Parrainer un enfant
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Mon Espace Parrain</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/messages")} className="bg-white/80 backdrop-blur-sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </Button>
            <Button variant="outline" onClick={() => navigate("/sponsor-album")} className="bg-white/80 backdrop-blur-sm">
              <Album className="w-4 h-4 mr-2" />
              Album Photos
            </Button>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-cuba-warmBeige to-cuba-softOrange border-none">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Image className="w-6 h-6 text-cuba-turquoise" />
              </div>
              <div>
                <h3 className="font-semibold">Album Photos</h3>
                <p className="text-sm text-gray-700">Gérez vos photos</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-cuba-softYellow to-cuba-sand border-none">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <MessageSquare className="w-6 h-6 text-cuba-turquoise" />
              </div>
              <div>
                <h3 className="font-semibold">Messages</h3>
                <p className="text-sm text-gray-700">Communiquez avec l'assistant</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-cuba-pink to-cuba-coral border-none">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Calendar className="w-6 h-6 text-cuba-turquoise" />
              </div>
              <div>
                <h3 className="font-semibold">Visites Prévues</h3>
                <p className="text-sm text-gray-700">Planifiez vos visites</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sponsored Children Section */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-none shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Mes Filleuls</h2>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6">
                  {sponsorships.map((sponsorship) => (
                    <SponsoredChildSection
                      key={sponsorship.id}
                      sponsorship={sponsorship}
                      userId={user.id}
                    />
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Important Dates */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-none shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Dates Importantes</h2>
              <ImportantDatesCard 
                plannedVisits={[]}
                birthDates={sponsorships.map(s => ({
                  childName: s.children.name,
                  birthDate: s.children.birth_date
                }))}
              />
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-none shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Actions Rapides</h2>
              <DashboardActions />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorDashboard;