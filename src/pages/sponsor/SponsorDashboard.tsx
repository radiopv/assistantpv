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
        <div className="flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-medium text-gray-800">{t.sponsorDashboard}</h2>
        </div>

        {/* Notifications Section */}
        <div className="mb-4">
          <NeedNotifications />
        </div>

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
                className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 md:p-6"
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
                      <span className="text-red-500 font-medium animate-pulse mt-2 md:mt-0">
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
                  <TabsList className="w-full grid grid-cols-3 md:grid-cols-5 gap-1">
                    <TabsTrigger value="photos" className="text-xs md:text-sm">{t.photos}</TabsTrigger>
                    <TabsTrigger value="testimonials" className="text-xs md:text-sm">{t.testimonials}</TabsTrigger>
                    <TabsTrigger value="statistics" className="text-xs md:text-sm">{t.statistics}</TabsTrigger>
                    <TabsTrigger value="needs" className="text-xs md:text-sm hidden md:block">{t.needs}</TabsTrigger>
                    <TabsTrigger value="story" className="text-xs md:text-sm hidden md:block">{t.story}</TabsTrigger>
                  </TabsList>

                  <div className="mt-4 space-y-4">
                    <TabsContent value="photos">
                      <PhotoGallery 
                        photos={childPhotos} 
                        childName={sponsorship.children?.name} 
                      />
                    </TabsContent>

                    <TabsContent value="testimonials">
                      <TestimonialSection testimonials={childTestimonials} />
                    </TabsContent>

                    <TabsContent value="statistics">
                      <StatisticsSection
                        photos={childPhotos}
                        needs={childNeeds}
                        sponsorshipDuration={calculateSponsorshipDuration(sponsorship.start_date)}
                        sponsorshipStartDate={sponsorship.start_date}
                      />
                    </TabsContent>

                    <TabsContent value="needs">
                      <NeedsSection needs={childNeeds} />
                    </TabsContent>

                    <TabsContent value="story">
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