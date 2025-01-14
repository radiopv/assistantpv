import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/Auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Share2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { differenceInDays } from "date-fns";
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

const SponsorDashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const translations = {
    fr: {
      welcomeMessage: "Bienvenue",
      inviteFriends: "Inviter des amis",
      loginRequired: "Veuillez vous connecter pour accéder à votre tableau de bord",
      login: "Se connecter",
      loading: "Chargement...",
      sponsorDashboard: "Mon Espace Parrain",
      shareError: "Le partage n'est pas disponible sur votre appareil",
      copySuccess: "Lien copié dans le presse-papiers !",
      copyError: "Impossible de copier le lien",
      photos: "Photos",
      testimonials: "Témoignages",
      statistics: "Statistiques",
      needs: "Besoins",
      story: "Histoire",
    },
    es: {
      welcomeMessage: "Bienvenido",
      inviteFriends: "Invitar amigos",
      loginRequired: "Por favor, inicie sesión para acceder a su panel",
      login: "Iniciar sesión",
      loading: "Cargando...",
      sponsorDashboard: "Mi Panel de Padrino",
      shareError: "El compartir no está disponible en su dispositivo",
      copySuccess: "¡Enlace copiado al portapapeles!",
      copyError: "No se pudo copiar el enlace",
      photos: "Fotos",
      testimonials: "Testimonios",
      statistics: "Estadísticas",
      needs: "Necesidades",
      story: "Historia",
    }
  };

  const t = translations[language as keyof typeof translations];

  const handleAddPhoto = (childId?: string) => {
    if (childId) {
      navigate(`/children/${childId}/album`);
    }
  };

  const handleAddTestimonial = (childId?: string) => {
    if (childId) {
      navigate('/testimonials/new', { state: { childId } });
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

  const { data: childrenPhotos } = useQuery({
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
    const diffTime = Math.abs(now.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-none rounded-lg shadow-lg">
          <p className="text-center text-gray-700">{t.loginRequired}</p>
          <Button 
            onClick={() => navigate("/login")}
            className="mt-4 mx-auto block bg-cuba-turquoise hover:bg-cuba-turquoise/90 text-white"
          >
            {t.login}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-offwhite to-cuba-warmBeige p-4 md:p-6">
      <div className="container mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium text-gray-800">{t.sponsorDashboard}</h2>
          <Button 
            onClick={handleShare}
            className="bg-cuba-turquoise hover:bg-cuba-turquoise/90 text-white flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            {t.inviteFriends}
          </Button>
        </div>

        <div className="grid gap-6">
          {sponsoredChildren?.map((sponsorship) => {
            const childPhotos = childrenPhotos?.filter(photo => 
              photo.child_id === sponsorship.children?.id
            ) || [];

            const childTestimonials = testimonials?.filter(testimonial =>
              testimonial.child_id === sponsorship.children?.id
            ) || [];

            return (
              <Card 
                key={sponsorship.id} 
                className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <SponsoredChildCard
                    child={sponsorship.children}
                    onAddPhoto={() => handleAddPhoto(sponsorship.children?.id)}
                    onAddTestimonial={() => handleAddTestimonial(sponsorship.children?.id)}
                  />

                  <Tabs defaultValue="photos" className="mt-6">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="photos">{t.photos}</TabsTrigger>
                      <TabsTrigger value="testimonials">{t.testimonials}</TabsTrigger>
                      <TabsTrigger value="statistics">{t.statistics}</TabsTrigger>
                      <TabsTrigger value="needs">{t.needs}</TabsTrigger>
                      <TabsTrigger value="story">{t.story}</TabsTrigger>
                    </TabsList>

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
                        needs={sponsorship.children?.needs || []}
                        sponsorshipDuration={calculateSponsorshipDuration(sponsorship.start_date)}
                        sponsorshipStartDate={sponsorship.start_date}
                      />
                    </TabsContent>

                    <TabsContent value="needs">
                      <NeedsSection needs={sponsorship.children?.needs} />
                    </TabsContent>

                    <TabsContent value="story">
                      <StorySection
                        description={sponsorship.children?.description}
                        story={sponsorship.children?.story}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SponsorDashboard;