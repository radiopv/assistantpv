import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SponsoredChildCard } from "@/components/Sponsors/Dashboard/Cards/SponsoredChildCard";
import { useAuth } from "@/components/Auth/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { PhotoUploader } from "@/components/AssistantPhotos/PhotoUploader";
import { ContributionStats } from "@/components/Sponsors/Dashboard/ContributionStats";
import { DetailedNotification } from "@/components/Sponsors/Dashboard/DetailedNotification";
import { PlannedVisitForm } from "@/components/Sponsors/Dashboard/PlannedVisitForm";
import { Camera, FileText, Clock, UserPlus, Calendar } from "lucide-react";

const SponsorDashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  const translations = {
    fr: {
      dashboard: "Mon Espace Parrain",
      addPhoto: "Ajouter des photos",
      addTestimonial: "Ajouter un témoignage",
      endSponsorship: "Mettre fin au parrainage",
      addChild: "Ajouter un enfant",
      planVisit: "Planifier une visite",
      loading: "Chargement...",
      uploadSuccess: "Photo ajoutée avec succès",
      uploadError: "Erreur lors de l'ajout de la photo",
      children: "Mes enfants parrainés",
      actions: "Actions",
      visits: "Visites",
    },
    es: {
      dashboard: "Mi Panel de Padrino",
      addPhoto: "Agregar fotos",
      addTestimonial: "Agregar testimonio",
      endSponsorship: "Finalizar el apadrinamiento",
      addChild: "Agregar un niño",
      planVisit: "Planificar una visita",
      loading: "Cargando...",
      uploadSuccess: "Foto agregada con éxito",
      uploadError: "Error al agregar la foto",
      children: "Mis niños apadrinados",
      actions: "Acciones",
      visits: "Visitas"
    }
  };

  const t = translations[language as keyof typeof translations];

  const { data: sponsoredChildren, isLoading: childrenLoading } = useQuery({
    queryKey: ["sponsored-children", user?.id],
    queryFn: async () => {
      const { data: sponsorships, error } = await supabase
        .from('sponsorships')
        .select(`
          id,
          child_id,
          start_date,
          children (
            id,
            name,
            photo_url,
            city,
            birth_date,
            description,
            story,
            needs,
            age
          )
        `)
        .eq('sponsor_id', user?.id)
        .eq('status', 'active');

      if (error) throw error;
      return sponsorships || [];
    },
    enabled: !!user?.id
  });

  if (childrenLoading) {
    return <div className="text-center p-4">{t.loading}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige/20 to-cuba-offwhite p-4">
      <div className="container mx-auto space-y-6">
        <h2 className="text-2xl font-medium text-gray-800">{t.dashboard}</h2>

        <ContributionStats sponsorId={user?.id || ''} />

        <Tabs defaultValue="children" className="w-full">
          <TabsList className="grid grid-cols-2 lg:grid-cols-5 gap-2 bg-transparent h-auto p-0">
            <TabsTrigger 
              value="children" 
              className="w-full data-[state=active]:bg-cuba-coral data-[state=active]:text-white px-4 py-2 rounded-md"
            >
              {t.children}
            </TabsTrigger>
            <TabsTrigger 
              value="actions" 
              className="w-full data-[state=active]:bg-cuba-coral data-[state=active]:text-white px-4 py-2 rounded-md"
            >
              {t.actions}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="children" className="mt-6">
            <div className="grid gap-6">
              {sponsoredChildren?.map((sponsorship) => {
                const child = sponsorship.children;
                if (!child) return null;

                return (
                  <SponsoredChildCard
                    key={child.id}
                    child={child}
                    sponsorshipId={sponsorship.id}
                    onAddPhoto={() => setSelectedChild(child.id)}
                  />
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="actions" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="p-6 flex flex-col items-center space-y-4 hover:shadow-lg transition-shadow">
                <Camera className="h-8 w-8 text-cuba-turquoise" />
                <h3 className="font-semibold">{t.addPhoto}</h3>
                {selectedChild && (
                  <PhotoUploader
                    childId={selectedChild}
                    onUploadSuccess={() => setSelectedChild(null)}
                  />
                )}
              </Card>

              <Card className="p-6 flex flex-col items-center space-y-4 hover:shadow-lg transition-shadow">
                <FileText className="h-8 w-8 text-cuba-turquoise" />
                <h3 className="font-semibold">{t.addTestimonial}</h3>
              </Card>

              <Card className="p-6 flex flex-col items-center space-y-4 hover:shadow-lg transition-shadow">
                <Clock className="h-8 w-8 text-cuba-turquoise" />
                <h3 className="font-semibold">{t.endSponsorship}</h3>
              </Card>

              <Card className="p-6 flex flex-col items-center space-y-4 hover:shadow-lg transition-shadow">
                <UserPlus className="h-8 w-8 text-cuba-turquoise" />
                <h3 className="font-semibold">{t.addChild}</h3>
              </Card>

              <Card className="p-6 flex flex-col items-center space-y-4 hover:shadow-lg transition-shadow">
                <Calendar className="h-8 w-8 text-cuba-turquoise" />
                <h3 className="font-semibold">{t.planVisit}</h3>
                <PlannedVisitForm 
                  sponsorId={user?.id || ''} 
                  onVisitPlanned={() => {}} 
                />
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SponsorDashboard;