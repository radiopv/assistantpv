import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { SponsoredChildCard } from "@/components/Sponsors/Dashboard/Cards/SponsoredChildCard";
import { useAuth } from "@/components/Auth/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { PhotoUploader } from "@/components/AssistantPhotos/PhotoUploader";
import { ContributionStats } from "@/components/Sponsors/Dashboard/ContributionStats";
import { SponsorshipTimeline } from "@/components/Sponsors/Dashboard/SponsorshipTimeline";
import { VisitsSection } from "@/components/Sponsors/Dashboard/VisitsSection";
import { StatisticsSection } from "@/components/Sponsors/Dashboard/Sections/StatisticsSection";
import { DetailedNotification } from "@/components/Sponsors/Dashboard/DetailedNotification";

const SponsorDashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  const translations = {
    fr: {
      welcomeMessage: "Bienvenue",
      loading: "Chargement...",
      sponsorDashboard: "Mon Espace Parrain",
      uploadSuccess: "Photo ajoutée avec succès",
      uploadError: "Erreur lors de l'ajout de la photo"
    },
    es: {
      welcomeMessage: "Bienvenido",
      loading: "Cargando...",
      sponsorDashboard: "Mi Panel de Padrino",
      uploadSuccess: "Foto agregada con éxito",
      uploadError: "Error al agregar la foto"
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

  const { data: plannedVisits = [] } = useQuery({
    queryKey: ['planned-visits', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('planned_visits')
        .select('*')
        .eq('sponsor_id', user?.id)
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  const handleAddPhoto = (childId: string) => {
    setSelectedChild(childId);
  };

  const handleUploadSuccess = async () => {
    if (selectedChild) {
      toast.success(t.uploadSuccess);
      setSelectedChild(null);
    }
  };

  if (childrenLoading) {
    return <div className="text-center p-4">{t.loading}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige/20 to-cuba-offwhite p-4">
      <div className="container mx-auto space-y-6">
        <h2 className="text-2xl font-medium text-gray-800">{t.sponsorDashboard}</h2>

        <div className="grid gap-6">
          {/* Sponsored Children Cards */}
          {sponsoredChildren?.map((sponsorship) => {
            const child = sponsorship.children;
            if (!child) return null;

            return (
              <div key={child.id} className="space-y-6">
                <SponsoredChildCard
                  child={child}
                  sponsorshipId={sponsorship.id}
                  onAddPhoto={() => handleAddPhoto(child.id)}
                  onAddTestimonial={() => {}}
                />

                {selectedChild === child.id && (
                  <Card className="p-4">
                    <PhotoUploader
                      childId={selectedChild}
                      onUploadSuccess={handleUploadSuccess}
                    />
                  </Card>
                )}
              </div>
            );
          })}

          {/* Contribution Stats */}
          <ContributionStats
            totalPhotos={0}
            totalTestimonials={0}
            totalNeeds={0}
            sponsorshipDays={0}
          />

          {/* Timeline */}
          <SponsorshipTimeline events={[]} />

          {/* Notifications */}
          <DetailedNotification />

          {/* Planned Visits */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'fr' ? 'Visites Planifiées' : 'Visitas Planificadas'}
            </h3>
            <VisitsSection visits={plannedVisits} />
          </Card>

          {/* Statistics */}
          <StatisticsSection
            photos={[]}
            needs={[]}
            sponsorshipDuration={0}
            sponsorshipStartDate=""
          />
        </div>
      </div>
    </div>
  );
};

export default SponsorDashboard;