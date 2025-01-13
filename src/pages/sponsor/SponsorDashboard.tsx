import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Share2, MessageSquare, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { SponsoredChildSection } from "@/components/Sponsors/Dashboard/SponsoredChildSection";

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
      noSponsorships: "Vous ne parrainez pas encore d'enfant.",
      becomeASponsor: "Devenir parrain",
      messages: "Messages",
      communicateWithAssistant: "Communiquez avec l'assistant",
      plannedVisits: "Visites Prévues",
      manageVisits: "Gérez vos visites",
      shareError: "Le partage n'est pas disponible sur votre appareil",
      copySuccess: "Lien copié dans le presse-papiers !",
      copyError: "Impossible de copier le lien"
    },
    es: {
      welcomeMessage: "Bienvenido",
      inviteFriends: "Invitar amigos",
      loginRequired: "Por favor, inicie sesión para acceder a su panel.",
      login: "Iniciar sesión",
      loading: "Cargando...",
      sponsorDashboard: "Mi Panel de Padrino",
      noSponsorships: "Aún no apadrina a ningún niño.",
      becomeASponsor: "Convertirse en padrino",
      messages: "Mensajes",
      communicateWithAssistant: "Comuníquese con el asistente",
      plannedVisits: "Visitas Planificadas",
      manageVisits: "Gestione sus visitas",
      shareError: "El compartir no está disponible en su dispositivo",
      copySuccess: "¡Enlace copiado al portapapeles!",
      copyError: "No se pudo copiar el enlace"
    }
  };

  const { data: sponsorships, isLoading } = useQuery({
    queryKey: ["sponsorships", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("sponsorships")
        .select(`
          id,
          sponsor_id,
          child_id,
          status,
          start_date,
          end_date,
          children (
            id,
            name,
            birth_date,
            photo_url,
            city,
            needs,
            description,
            story,
            comments,
            age,
            gender
          )
        `)
        .eq("sponsor_id", user.id)
        .eq("status", "active");

      if (error) {
        console.error("Error fetching sponsorships:", error);
        toast.error("Impossible de charger vos parrainages");
        return null;
      }

      return data;
    },
    enabled: !!user?.id
  });

  const { data: plannedVisits } = useQuery({
    queryKey: ["planned-visits", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("planned_visits")
        .select("*")
        .eq("sponsor_id", user.id)
        .gte("start_date", new Date().toISOString())
        .order("start_date", { ascending: true });

      if (error) {
        console.error("Error fetching planned visits:", error);
        return null;
      }

      return data;
    },
    enabled: !!user?.id
  });

  const handleShare = async () => {
    const shareData = {
      title: translations[language].inviteFriends,
      text: translations[language].becomeASponsor,
      url: window.location.origin + '/become-sponsor'
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareData.url);
        toast.success(translations[language].copySuccess);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      if (error.name === 'NotAllowedError') {
        toast.error(translations[language].shareError);
      } else {
        toast.error(translations[language].copyError);
      }
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <div className="p-6 bg-white/80 backdrop-blur-sm border-none rounded-lg shadow-lg">
          <p className="text-center text-gray-700">{translations[language].loginRequired}</p>
          <Button 
            onClick={() => navigate("/login")}
            className="mt-4 mx-auto block bg-cuba-turquoise hover:bg-cuba-turquoise/90 text-white"
          >
            {translations[language].login}
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-gray-700">{translations[language].loading}</p>
      </div>
    );
  }

  if (!sponsorships?.length) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">{translations[language].sponsorDashboard}</h1>
        <div className="p-6 bg-white/80 backdrop-blur-sm border-none rounded-lg shadow-lg">
          <p className="text-gray-700 mb-4">{translations[language].noSponsorships}</p>
          <Button 
            onClick={() => navigate("/become-sponsor")}
            className="bg-cuba-turquoise hover:bg-cuba-turquoise/90 text-white"
          >
            {translations[language].becomeASponsor}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-offwhite to-cuba-warmBeige">
      <div 
        className="relative h-[300px] bg-cover bg-center mb-8"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('/cuba-beach.jpg')"
        }}
      >
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <h1 className="text-4xl md:text-5xl font-title text-white mb-6 animate-fade-in">
            {translations[language].welcomeMessage}, {user.email}
          </h1>
          <Button 
            onClick={handleShare}
            className="bg-cuba-turquoise hover:bg-cuba-turquoise/90 text-white flex items-center gap-2 animate-fade-in"
          >
            <Share2 className="w-4 h-4" />
            {translations[language].inviteFriends}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-cuba-warmBeige to-cuba-softOrange border-none transform hover:scale-105 transition-transform duration-200 h-auto"
              onClick={() => navigate("/messages")}
            >
              <div className="flex items-center gap-4 w-full">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <MessageSquare className="w-6 h-6 text-cuba-turquoise" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800">{translations[language].messages}</h3>
                  <p className="text-sm text-gray-700">{translations[language].communicateWithAssistant}</p>
                </div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-cuba-pink to-cuba-coral border-none transform hover:scale-105 transition-transform duration-200 h-auto"
              onClick={() => navigate("/planned-visits")}
            >
              <div className="flex items-center gap-4 w-full">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Calendar className="w-6 h-6 text-cuba-turquoise" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800">{translations[language].plannedVisits}</h3>
                  <p className="text-sm text-gray-700">{translations[language].manageVisits}</p>
                </div>
              </div>
            </Button>
          </div>

          <div className="grid gap-6">
            {sponsorships.map((sponsorship) => (
              <SponsoredChildSection
                key={sponsorship.id}
                sponsorship={sponsorship}
                userId={user.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorDashboard;
