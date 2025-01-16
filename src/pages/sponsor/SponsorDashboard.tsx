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
import { BirthdayCountdown } from "@/components/Sponsors/Dashboard/BirthdayCountdown";
import { SponsorshipTimeline } from "@/components/Sponsors/Dashboard/SponsorshipTimeline";
import { ContributionStats } from "@/components/Sponsors/Dashboard/ContributionStats";
import { Camera, FileEdit, Clock } from "lucide-react";

const SponsorDashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [showTermination, setShowTermination] = useState(false);

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
      copyError: "Erreur lors de la copie du lien",
      noNotifications: "Aucune notification pour le moment",
      addPhoto: "Ajouter une photo",
      addTestimonial: "Ajouter un témoignage",
      endSponsorship: "Mettre fin au parrainage"
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
      copyError: "Error al copiar el enlace",
      noNotifications: "No hay notificaciones por el momento",
      addPhoto: "Agregar foto",
      addTestimonial: "Agregar testimonio",
      endSponsorship: "Finalizar apadrinamiento"
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
        .select(`
          id,
          url,
          type,
          title,
          description,
          is_featured,
          created_at,
          child_id,
          sponsor_id
        `)
        .in('child_id', sponsoredChildren.map(s => s.children?.id))
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching photos:', error);
        throw error;
      }

      console.log('Fetched photos:', data);
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
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige/20 to-cuba-offwhite p-0">
      <div className="container mx-auto space-y-4 md:space-y-6 p-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4">
          <h2 className="text-lg md:text-xl font-medium text-gray-800">{t.sponsorDashboard}</h2>
        </div>

        <div className="mb-4 w-full">
          <NeedNotifications />
        </div>

        <div className="grid md:grid-cols-2 gap-4 w-full">
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
              acc + (convertJsonToNeeds(s.children?.needs)?.length || 0), 0
            ) || 0}
            sponsorshipDays={sponsoredChildren?.reduce((acc, s) => 
              acc + calculateSponsorshipDuration(s.start_date), 0
            ) || 0}
          />
        </div>

        <div className="w-full">
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
        </div>

        <Card className="w-full p-4 md:p-6 bg-white/80 backdrop-blur-sm border border-cuba-softOrange/20 rounded-none md:rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-cuba-coral">Visites planifiées</h3>
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

        <div className="grid gap-4 md:gap-6 w-full">
          {sponsoredChildren?.map((sponsorship) => (
            <Card 
              key={sponsorship.id} 
              className="w-full overflow-hidden bg-white/80 backdrop-blur-sm border border-cuba-softOrange/20 shadow-lg hover:shadow-xl transition-shadow duration-300 p-3 md:p-6 rounded-none md:rounded-lg"
            >
              <div className="flex flex-col gap-4 w-full">
                <div className="flex-1 w-full">
                  <SponsoredChildCard
                    child={sponsorship.children}
                    sponsorshipId={sponsorship.id}
                    onAddPhoto={() => handleAddPhoto(sponsorship.children?.id)}
                    onAddTestimonial={() => navigate('/testimonials/new', { state: { childId: sponsorship.children?.id } })}
                  />
                </div>

                {/* Photo Grid */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {childrenPhotos
                    .filter(photo => photo.child_id === sponsorship.children?.id)
                    .map((photo) => (
                      <div 
                        key={photo.id} 
                        className="aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <img
                          src={photo.url}
                          alt={photo.title || "Photo album"}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onClick={() => window.open(photo.url, '_blank')}
                        />
                      </div>
                    ))}
                </div>
              </div>

              {/* Photo uploader */}
              {selectedChild === sponsorship.children?.id && (
                <div className="mt-4 w-full">
                  <PhotoUploader
                    childId={selectedChild}
                    onUploadSuccess={handleUploadSuccess}
                  />
                </div>
              )}

              <Tabs defaultValue="photos" className="mt-4 md:mt-6 w-full">
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

                <div className="mt-6 space-y-6 w-full">
                  <TabsContent value="photos" className="focus:outline-none">
                    <PhotoGallery 
                      photos={(childrenPhotos || []).filter(photo => photo.child_id === sponsorship.children?.id)} 
                      childName={sponsorship.children?.name} 
                    />
                  </TabsContent>

                  <TabsContent value="testimonials" className="focus:outline-none">
                    <TestimonialSection testimonials={(testimonials || []).filter(testimonial => testimonial.child_id === sponsorship.children?.id)} />
                  </TabsContent>

                  <TabsContent value="statistics" className="focus:outline-none">
                    <StatisticsSection
                      photos={(childrenPhotos || []).filter(photo => photo.child_id === sponsorship.children?.id)}
                      needs={convertJsonToNeeds(sponsorship.children?.needs)}
                      sponsorshipDuration={calculateSponsorshipDuration(sponsorship.start_date)}
                      sponsorshipStartDate={sponsorship.start_date}
                    />
                  </TabsContent>

                  <TabsContent value="needs" className="focus:outline-none">
                    <NeedsSection needs={convertJsonToNeeds(sponsorship.children?.needs)} />
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorDashboard;
