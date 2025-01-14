import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Share2, ChevronDown, ChevronUp, Image, Calendar, Heart, ChartBar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NeedNotifications } from "@/components/Dashboard/NeedNotifications";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SponsorDashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const translations = {
    fr: {
      welcomeMessage: "Bienvenue",
      inviteFriends: "Inviter des amis",
      loginRequired: "Veuillez vous connecter pour accéder à votre tableau de bord.",
      login: "Se connecter",
      loading: "Chargement...",
      sponsorDashboard: "Mon Espace Parrain",
      shareError: "Le partage n'est pas disponible sur votre appareil",
      copySuccess: "Lien copié dans le presse-papiers !",
      copyError: "Impossible de copier le lien",
      photos: "Photos",
      testimonials: "Témoignages",
      statistics: "Statistiques",
      birthday: "Anniversaire",
      needs: "Besoins",
      nextBirthday: "Prochain anniversaire",
      daysLeft: "jours restants",
      addTestimonial: "Ajouter un témoignage",
      viewProfile: "Voir le profil"
    },
    es: {
      welcomeMessage: "Bienvenido",
      inviteFriends: "Invitar amigos",
      loginRequired: "Por favor, inicie sesión para acceder a su panel.",
      login: "Iniciar sesión",
      loading: "Cargando...",
      sponsorDashboard: "Mi Panel de Padrino",
      shareError: "El compartir no está disponible en su dispositivo",
      copySuccess: "¡Enlace copiado al portapapeles!",
      copyError: "No se pudo copiar el enlace"
    }
  };

  const t = translations[language as keyof typeof translations];

  const { data: sponsoredChildren, isLoading } = useQuery({
    queryKey: ["sponsored-children", user?.id],
    queryFn: async () => {
      const { data: sponsorships, error } = await supabase
        .from('sponsorships')
        .select(`
          id,
          child_id,
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

  // Query pour récupérer les photos des enfants
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

        <NeedNotifications />

        <div className="grid gap-6">
          {sponsoredChildren?.map((sponsorship) => {
            const childPhotos = childrenPhotos?.filter(photo => 
              photo.child_id === sponsorship.children?.id
            ) || [];

            return (
              <Card 
                key={sponsorship.id} 
                className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center gap-4">
                        <img
                          src={sponsorship.children?.photo_url || "/placeholder.svg"}
                          alt={sponsorship.children?.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="text-left">
                          <h3 className="text-lg font-semibold">{sponsorship.children?.name}</h3>
                          <p className="text-sm text-gray-600">{sponsorship.children?.city}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent className="px-6 pb-4">
                      <Tabs defaultValue="photos" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 mb-4">
                          <TabsTrigger value="photos" className="flex items-center gap-2">
                            <Image className="w-4 h-4" />
                            {t.photos}
                          </TabsTrigger>
                          <TabsTrigger value="testimonials" className="flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            {t.testimonials}
                          </TabsTrigger>
                          <TabsTrigger value="statistics" className="flex items-center gap-2">
                            <ChartBar className="w-4 h-4" />
                            {t.statistics}
                          </TabsTrigger>
                          <TabsTrigger value="birthday" className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {t.birthday}
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="photos" className="space-y-4">
                          <div className="grid grid-cols-3 gap-2">
                            {childPhotos.slice(0, 3).map((photo) => (
                              <div 
                                key={photo.id} 
                                className="aspect-square relative overflow-hidden rounded-lg"
                              >
                                <img
                                  src={photo.url}
                                  alt={`Photo de ${sponsorship.children?.name}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </TabsContent>

                        <TabsContent value="testimonials" className="space-y-4">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => navigate('/testimonials/new')}
                          >
                            {t.addTestimonial}
                          </Button>
                        </TabsContent>

                        <TabsContent value="statistics" className="space-y-4">
                          {/* Add statistics content here */}
                        </TabsContent>

                        <TabsContent value="birthday" className="space-y-4">
                          <div className="bg-cuba-warmBeige/20 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">{t.nextBirthday}</h4>
                            <p className="text-2xl font-bold text-cuba-coral">
                              {/* Add birthday countdown logic here */}
                              365 {t.daysLeft}
                            </p>
                          </div>
                        </TabsContent>
                      </Tabs>

                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/child/${sponsorship.children?.id}`)}
                        >
                          {t.viewProfile}
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SponsorDashboard;