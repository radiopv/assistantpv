import { Button } from "@/components/ui/button";
import { MessageSquare, Calendar, Share2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const DashboardActions = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const translations = {
    fr: {
      messages: "Messages",
      communicateWithAssistant: "Communiquez avec l'assistant",
      plannedVisits: "Visites Prévues",
      manageVisits: "Gérez vos visites",
      inviteFriends: "Inviter des amis",
      shareError: "Le partage n'est pas disponible sur votre appareil",
      copySuccess: "Lien copié dans le presse-papiers !",
      copyError: "Impossible de copier le lien"
    },
    es: {
      messages: "Mensajes",
      communicateWithAssistant: "Comuníquese con el asistente",
      plannedVisits: "Visitas Planificadas",
      manageVisits: "Gestione sus visitas",
      inviteFriends: "Invitar amigos",
      shareError: "El compartir no está disponible en su dispositivo",
      copySuccess: "¡Enlace copiado al portapapeles!",
      copyError: "No se pudo copiar el enlace"
    }
  };

  const t = translations[language as keyof typeof translations];

  const handleShare = async () => {
    const shareData = {
      title: t.inviteFriends,
      text: "Passion Varadero - Parrainage d'enfants cubains",
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
      if (error.name === 'NotAllowedError') {
        toast.error(t.shareError);
      } else {
        toast.error(t.copyError);
      }
    }
  };

  return (
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
            <h3 className="font-semibold text-gray-800">{t.messages}</h3>
            <p className="text-sm text-gray-700">{t.communicateWithAssistant}</p>
          </div>
        </div>
      </Button>
      
      <Button
        variant="outline"
        className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-cuba-pink to-cuba-coral border-none transform hover:scale-105 transition-transform duration-200 h-auto"
        onClick={() => document.querySelector('[value="visits"]')?.dispatchEvent(new Event('click'))}
      >
        <div className="flex items-center gap-4 w-full">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <Calendar className="w-6 h-6 text-cuba-turquoise" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-800">{t.plannedVisits}</h3>
            <p className="text-sm text-gray-700">{t.manageVisits}</p>
          </div>
        </div>
      </Button>

      <Button
        variant="outline"
        className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-cuba-warmBeige to-cuba-softOrange border-none transform hover:scale-105 transition-transform duration-200 h-auto md:col-span-2"
        onClick={handleShare}
      >
        <div className="flex items-center gap-4 w-full">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <Share2 className="w-6 h-6 text-cuba-turquoise" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-800">{t.inviteFriends}</h3>
          </div>
        </div>
      </Button>
    </div>
  );
};