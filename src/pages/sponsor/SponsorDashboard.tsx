import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { SponsoredChildCard } from "@/components/Sponsors/Dashboard/Cards/SponsoredChildCard";
import { useAuth } from "@/components/Auth/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { PhotoUploader } from "@/components/AssistantPhotos/PhotoUploader";
import { ContributionStats } from "@/components/Sponsors/Dashboard/ContributionStats";
import { SponsorshipTimeline } from "@/components/Sponsors/Dashboard/SponsorshipTimeline";
import { VisitsSection } from "@/components/Sponsors/Dashboard/VisitsSection";
import { DetailedNotification } from "@/components/Sponsors/Dashboard/DetailedNotification";
import { PlannedVisitForm } from "@/components/Sponsors/Dashboard/PlannedVisitForm";

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
      uploadError: "Erreur lors de l'ajout de la photo",
      plannedVisits: "Visites Planifiées",
      noAccess: "Accès non autorisé"
    },
    es: {
      welcomeMessage: "Bienvenido",
      loading: "Cargando...",
      sponsorDashboard: "Mi Panel de Padrino",
      uploadSuccess: "Foto agregada con éxito",
      uploadError: "Error al agregar la foto",
      plannedVisits: "Visitas Planificadas",
      noAccess: "Acceso no autorizado"
    }
  };

  const t = translations[language as keyof typeof translations];

  if (!user?.id) {
    return <div className="text-center p-4">{t.noAccess}</div>;
  }

  const { data: sponsoredChildren, isLoading: childrenLoading } = useQuery({
    queryKey: ["sponsored-children", user.id],
    queryFn: async () => {
      console.log("Fetching sponsored children for user:", user.id);
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
        .eq('sponsor_id', user.id)
        .eq('status', 'active');

      if (error) {
        console.error("Error fetching sponsorships:", error);
        throw error;
      }
      console.log("Fetched sponsorships:", sponsorships);
      return sponsorships || [];
    },
    enabled: !!user.id
  });

  const { data: plannedVisits = [], refetch: refetchVisits } = useQuery({
    queryKey: ['planned-visits', user.id],
    queryFn: async () => {
      console.log("Fetching planned visits for user:", user.id);
      const { data, error } = await supabase
        .from('planned_visits')
        .select('*')
        .eq('sponsor_id', user.id)
        .order('start_date', { ascending: true });

      if (error) {
        console.error("Error fetching planned visits:", error);
        throw error;
      }
      console.log("Fetched planned visits:", data);
      return data;
    },
    enabled: !!user.id
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['sponsor-notifications', user.id],
    queryFn: async () => {
      console.log("Fetching notifications for user:", user.id);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }
      console.log("Fetched notifications:", data);
      return data;
    },
    enabled: !!user.id
  });

  const handleAddPhoto = (childId: string) => {
    setSelectedChild(childId);
  };

  const handleUploadSuccess = () => {
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
          {/* Contribution Stats */}
          {user?.id && <ContributionStats sponsorId={user.id} />}

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

          {/* Planned Visits */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {t.plannedVisits}
            </h3>
            <div className="space-y-6">
              <PlannedVisitForm 
                sponsorId={user.id} 
                onVisitPlanned={() => refetchVisits()} 
              />
              <VisitsSection visits={plannedVisits || []} onVisitDeleted={() => refetchVisits()} />
            </div>
          </Card>

          {/* Timeline */}
          <SponsorshipTimeline events={[]} />

          {/* Notifications */}
          {notifications?.map((notification) => (
            <DetailedNotification key={notification.id} notification={notification} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorDashboard;