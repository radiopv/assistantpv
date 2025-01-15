import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { differenceInYears, differenceInDays } from "date-fns";
import { PhotoUploader } from "@/components/AssistantPhotos/PhotoUploader";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, FileEdit, Clock, Heart, Calendar, ChartBar } from "lucide-react";
import { SponsoredChildCard } from "@/components/Sponsors/Dashboard/Cards/SponsoredChildCard";
import { ImportantDatesCard } from "@/components/Sponsors/Dashboard/Cards/ImportantDatesCard";
import { ContributionStats } from "@/components/Sponsors/Dashboard/ContributionStats";
import { BirthdayCountdown } from "@/components/Sponsors/Dashboard/BirthdayCountdown";
import { SponsorshipTimeline } from "@/components/Sponsors/Dashboard/SponsorshipTimeline";
import { NeedNotifications } from "@/components/Dashboard/NeedNotifications";

const SponsorDashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  const translations = {
    fr: {
      welcomeMessage: "Bienvenue",
      addPhoto: "Ajouter une photo",
      addTestimonial: "Ajouter un témoignage",
      endSponsorship: "Mettre fin au parrainage",
      uploadSuccess: "Photo ajoutée avec succès",
      uploadError: "Erreur lors de l'ajout de la photo",
      sponsorDashboard: "Mon Espace Parrain",
    },
    es: {
      welcomeMessage: "Bienvenido",
      addPhoto: "Agregar foto",
      addTestimonial: "Agregar testimonio",
      endSponsorship: "Finalizar apadrinamiento",
      uploadSuccess: "Foto agregada con éxito",
      uploadError: "Error al agregar la foto",
      sponsorDashboard: "Mi Panel de Padrino",
    }
  };

  const t = translations[language as keyof typeof translations];

  const handleAddPhoto = (childId: string) => {
    setSelectedChild(childId);
  };

  const handleUploadSuccess = async () => {
    if (selectedChild) {
      toast.success(t.uploadSuccess);
      setSelectedChild(null);
      refetchPhotos();
    }
  };

  const { data: sponsoredChildren, isLoading } = useQuery({
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

  const { data: childrenPhotos = [], refetch: refetchPhotos } = useQuery({
    queryKey: ["children-photos", sponsoredChildren?.map(s => s.child_id)],
    queryFn: async () => {
      if (!sponsoredChildren?.length) return [];
      
      const { data, error } = await supabase
        .from('album_media')
        .select('*')
        .in('child_id', sponsoredChildren.map(s => s.child_id))
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!sponsoredChildren?.length
  });

  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('temoignage')
        .select('*')
        .eq('sponsor_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  const { data: plannedVisits } = useQuery({
    queryKey: ['planned-visits', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('planned_visits')
        .select('*')
        .eq('sponsor_id', user?.id)
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const calculateSponsorshipDuration = (startDate: string) => {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const now = new Date();
    return differenceInDays(now, start);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige/20 to-cuba-offwhite p-2 md:p-6">
      <div className="container mx-auto space-y-4 md:space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-lg md:text-xl font-medium text-gray-800">{t.sponsorDashboard}</h2>
        </div>

        <div className="mb-4 w-full">
          <NeedNotifications />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <BirthdayCountdown 
            children={sponsoredChildren?.map(s => ({
              name: s.children?.name || '',
              birth_date: s.children?.birth_date || '',
              age: s.children?.age || 0
            })) || []}
          />
          <ContributionStats
            totalPhotos={childrenPhotos?.length || 0}
            totalTestimonials={testimonials?.length || 0}
            totalNeeds={sponsoredChildren?.reduce((acc, s) => 
              acc + (s.children?.needs?.length || 0), 0
            ) || 0}
            sponsorshipDays={sponsoredChildren?.reduce((acc, s) => 
              acc + calculateSponsorshipDuration(s.start_date), 0
            ) || 0}
          />
        </div>

        <SponsorshipTimeline
          events={[
            ...(sponsoredChildren?.map(s => ({
              date: s.start_date,
              type: 'sponsorship_start' as const,
              title: `Début du parrainage de ${s.children?.name}`,
            })) || []),
            ...(childrenPhotos?.map(p => ({
              date: p.created_at,
              type: 'photo' as const,
              title: 'Nouvelle photo ajoutée',
              description: p.title
            })) || []),
            ...(testimonials?.map(t => ({
              date: t.created_at,
              type: 'testimonial' as const,
              title: 'Nouveau témoignage',
            })) || [])
          ]}
        />

        <div className="grid gap-4 md:gap-6">
          {sponsoredChildren?.map((sponsorship) => (
            <Card 
              key={sponsorship.id} 
              className="overflow-hidden bg-white/80 backdrop-blur-sm border border-cuba-softOrange/20 shadow-lg hover:shadow-xl transition-shadow duration-300 p-3 md:p-6"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <SponsoredChildCard
                      child={sponsorship.children}
                      sponsorshipId={sponsorship.id}
                      onAddPhoto={() => handleAddPhoto(sponsorship.children?.id)}
                      onAddTestimonial={() => navigate('/testimonials/new', { state: { childId: sponsorship.children?.id } })}
                    />
                  </div>
                  <div className="flex flex-col space-y-2 mt-4 md:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleAddPhoto(sponsorship.children?.id)}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {translations[language].addPhoto}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => navigate('/testimonials/new', { state: { childId: sponsorship.children?.id } })}
                    >
                      <FileEdit className="h-4 w-4 mr-2" />
                      {translations[language].addTestimonial}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => navigate(`/sponsor/end-sponsorship/${sponsorship.id}`)}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {translations[language].endSponsorship}
                    </Button>
                  </div>
                </div>

                {selectedChild === sponsorship.children?.id && (
                  <div className="mt-4">
                    <PhotoUploader
                      childId={selectedChild}
                      onUploadSuccess={handleUploadSuccess}
                    />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorDashboard;