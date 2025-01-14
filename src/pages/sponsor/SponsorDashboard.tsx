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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { SponsoredChildCard } from "@/components/Sponsors/Dashboard/Cards/SponsoredChildCard";
import { PhotoGallery } from "@/components/Sponsors/Dashboard/Sections/PhotoGallery";
import { TestimonialSection } from "@/components/Sponsors/Dashboard/Sections/TestimonialSection";
import { StatisticsSection } from "@/components/Sponsors/Dashboard/Sections/StatisticsSection";
import { NeedsSection } from "@/components/Sponsors/Dashboard/Sections/NeedsSection";
import { StorySection } from "@/components/Sponsors/Dashboard/Sections/StorySection";
import { convertJsonToNeeds } from "@/types/needs";
import { NeedNotifications } from "@/components/Dashboard/NeedNotifications";
import { PlannedVisitForm } from "@/components/Sponsors/Dashboard/PlannedVisitForm";
import { VisitsSection } from "@/components/Sponsors/Dashboard/VisitsSection";
import { ImportantDatesCard } from "@/components/Sponsors/Dashboard/ImportantDatesCard";

const SponsorDashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  const translations = {
    fr: {
      welcomeMessage: "Bienvenue",
      inviteFriends: "Inviter des amis",
      loginRequired: "Veuillez vous connecter pour accéder à votre tableau de bord",
      login: "Se connecter",
      loading: "Chargement...",
      sponsorDashboard: "Mon Espace Parrain",
      photos: "Photos",
      testimonials: "Témoignages",
      statistics: "Statistiques",
      needs: "Besoins",
      story: "Histoire",
      uploadSuccess: "Photo ajoutée avec succès",
      uploadError: "Erreur lors de l'ajout de la photo",
      urgentNeeds: "Besoins urgents détectés !",
      age: "ans",
      copySuccess: "Lien copié avec succès !",
      copyError: "Erreur lors de la copie du lien"
    },
    es: {
      welcomeMessage: "Bienvenido",
      inviteFriends: "Invitar amigos",
      loginRequired: "Por favor, inicie sesión para acceder a su panel",
      login: "Iniciar sesión",
      loading: "Cargando...",
      sponsorDashboard: "Mi Panel de Padrino",
      photos: "Fotos",
      testimonials: "Testimonios",
      statistics: "Estadísticas",
      needs: "Necesidades",
      story: "Historia",
      uploadSuccess: "Foto agregada con éxito",
      uploadError: "Error al agregar la foto",
      urgentNeeds: "¡Necesidades urgentes detectadas!",
      age: "años",
      copySuccess: "¡Enlace copiado con éxito!",
      copyError: "Error al copiar el enlace"
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
      return sponsorships;
    },
    enabled: !!user?.id
  });

  const { data: childrenPhotos, refetch: refetchPhotos } = useQuery({
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

  const { data: testimonials } = useQuery({
    queryKey: ['testimonials', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('temoignage')
        .select('*')
        .eq('sponsor_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const { data: plannedVisits, refetch: refetchVisits } = useQuery({
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

  const handleShare = async () => {
    const shareData = {
      title: translations[language].inviteFriends,
      text: translations[language].inviteFriends,
      url: window.location.origin + '/become-sponsor'
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success(t.copySuccess);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error(t.copyError);
    }
  };

  const calculateSponsorshipDuration = (startDate: string) => {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const now = new Date();
    return differenceInDays(now, start);
  };

  const hasUrgentNeeds = (needs: any) => {
    const needsArray = convertJsonToNeeds(needs);
    return needsArray.some(need => need.is_urgent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-offwhite to-cuba-warmBeige p-2 md:p-6">
      <div className="container mx-auto space-y-4 md:space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-lg md:text-xl font-medium text-gray-800">{t.sponsorDashboard}</h2>
        </div>

        {/* Notifications Section */}
        <div className="mb-4 w-full">
          <NeedNotifications />
        </div>

        {/* Important Dates Card */}
        <ImportantDatesCard 
          birthDates={sponsoredChildren?.map(s => ({
            childName: s.children?.name || '',
            birthDate: s.children?.birth_date || ''
          })) || []}
          plannedVisits={plannedVisits || []}
        />

        {/* Planned Visits Section */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Visites planifiées</h3>
          <div className="space-y-6">
            <PlannedVisitForm 
              sponsorId={user?.id || ''} 
              onVisitPlanned={refetchVisits}
            />
            <VisitsSection 
              visits={plannedVisits || []} 
              onVisitDeleted={refetchVisits}
            />
          </div>
        </Card>

        <div className="grid gap-4 md:gap-6">
          {sponsoredChildren?.map((sponsorship) => {
            const childPhotos = childrenPhotos?.filter(photo => 
              photo.child_id === sponsorship.children?.id
            ) || [];

            const childTestimonials = testimonials?.filter(testimonial =>
              testimonial.child_id === sponsorship.children?.id
            ) || [];

            const childNeeds = sponsorship.children?.needs ? convertJsonToNeeds(sponsorship.children.needs) : [];
            const hasUrgentNeeds = childNeeds.some(need => need.is_urgent);
            const childAge = sponsorship.children?.birth_date ? 
              differenceInYears(new Date(), new Date(sponsorship.children.birth_date)) : 
              null;

            return (
              <Card 
                key={sponsorship.id} 
                className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 p-3 md:p-6"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <SponsoredChildCard
                      child={{
                        ...sponsorship.children,
                        age: childAge
                      }}
                      onAddPhoto={() => handleAddPhoto(sponsorship.children?.id)}
                      onAddTestimonial={() => navigate('/testimonials/new', { state: { childId: sponsorship.children?.id } })}
                    />
                    {hasUrgentNeeds && (
                      <span className="text-red-500 font-medium animate-pulse mt-2 md:mt-0 text-sm md:text-base">
                        {t.urgentNeeds}
                      </span>
                    )}
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

                <Tabs defaultValue="photos" className="mt-4 md:mt-6">
                  <TabsList className="flex flex-col w-full md:grid md:grid-cols-5 gap-2">
                    {[
                      { value: "photos", label: t.photos },
                      { value: "testimonials", label: t.testimonials },
                      { value: "statistics", label: t.statistics },
                      { value: "needs", label: t.needs },
                      { value: "story", label: t.story }
                    ].map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="w-full text-sm px-3 py-3 mb-1 md:mb-0 bg-white hover:bg-gray-50"
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <div className="mt-6 space-y-6">
                    <TabsContent value="photos" className="focus:outline-none">
                      <PhotoGallery 
                        photos={childPhotos} 
                        childName={sponsorship.children?.name} 
                      />
                    </TabsContent>

                    <TabsContent value="testimonials" className="focus:outline-none">
                      <TestimonialSection testimonials={childTestimonials} />
                    </TabsContent>

                    <TabsContent value="statistics" className="focus:outline-none">
                      <StatisticsSection
                        photos={childPhotos}
                        needs={childNeeds}
                        sponsorshipDuration={calculateSponsorshipDuration(sponsorship.start_date)}
                        sponsorshipStartDate={sponsorship.start_date}
                      />
                    </TabsContent>

                    <TabsContent value="needs" className="focus:outline-none">
                      <NeedsSection needs={childNeeds} />
                    </TabsContent>

                    <TabsContent value="story" className="focus:outline-none">
                      <StorySection
                        description={sponsorship.children?.description}
                        story={sponsorship.children?.story}
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SponsorDashboard;