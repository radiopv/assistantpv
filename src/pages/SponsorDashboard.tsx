import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  Plane,
  Gift,
  MessageSquare,
  Heart,
  Image,
} from "lucide-react";

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
        .gte("visit_date", new Date().toISOString())
        .order("visit_date", { ascending: true });

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
        {/* Photo et informations de l'enfant */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <img
                src={sponsoredChild.photo_url || "/placeholder.svg"}
                alt={sponsoredChild.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <h2 className="text-xl font-semibold">{sponsoredChild.name}</h2>
            </div>
            <p className="text-gray-600">{sponsoredChild.city}</p>
          </div>
        </Card>

        {/* Dates importantes */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <h3 className="font-semibold">Dates importantes</h3>
            </div>
            
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-primary" />
                Anniversaire : {format(new Date(sponsoredChild.birth_date), 'dd MMMM', { locale: fr })}
              </p>
              
              {plannedVisits?.map((visit) => (
                <p key={visit.id} className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-primary" />
                  Visite prévue : {format(new Date(visit.visit_date), 'dd MMMM yyyy', { locale: fr })}
                </p>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="actions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="gallery">Galerie Photos</TabsTrigger>
        </TabsList>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => navigate("/messages")}
              variant="outline"
              className="h-auto p-4 flex items-center gap-3"
            >
              <MessageSquare className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold">Message à l'assistant</p>
                <p className="text-sm text-gray-600">
                  Communiquez avec votre assistant
                </p>
              </div>
            </Button>

            <Button
              onClick={() => navigate("/testimonials/new")}
              variant="outline"
              className="h-auto p-4 flex items-center gap-3"
            >
              <Heart className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold">Ajouter un témoignage</p>
                <p className="text-sm text-gray-600">
                  Partagez votre expérience
                </p>
              </div>
            </Button>

            <Button
              onClick={() => navigate(`/children/${sponsoredChild.id}/album`)}
              variant="outline"
              className="h-auto p-4 flex items-center gap-3"
            >
              <Image className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold">Album photos</p>
                <p className="text-sm text-gray-600">
                  Gérez les photos de votre filleul(e)
                </p>
              </div>
            </Button>

            <Button
              onClick={() => navigate("/planned-visits/new")}
              variant="outline"
              className="h-auto p-4 flex items-center gap-3"
            >
              <Plane className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold">Planifier une visite</p>
                <p className="text-sm text-gray-600">
                  Organisez votre prochaine visite
                </p>
              </div>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          {/* Cette section sera implémentée avec l'album photo */}
          <Card className="p-6">
            <p>Album photos à venir...</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SponsorDashboard;