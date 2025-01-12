import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Heart, Image, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface SponsoredChildCardProps {
  child: any;
  onViewAlbum: (childId: string) => void;
}

export const SponsoredChildCard = ({ child, onViewAlbum }: SponsoredChildCardProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const translations = {
    fr: {
      viewProfile: "Voir le profil",
      viewAlbum: "Album photos",
      sendMessage: "Envoyer un message",
      age: "ans",
      months: "mois"
    },
    es: {
      viewProfile: "Ver perfil",
      viewAlbum: "Álbum de fotos",
      sendMessage: "Enviar mensaje",
      age: "años",
      months: "meses"
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-none">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={child.photo_url} alt={child.name} />
            <AvatarFallback>{child.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">{child.name}</h3>
            <p className="text-gray-600">
              {child.age} {child.age === 1 ? t.months : t.age}
            </p>
            <p className="text-gray-600">{child.city}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => navigate(`/children/${child.id}`)}
          >
            <Heart className="w-4 h-4" />
            {t.viewProfile}
          </Button>
          
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => onViewAlbum(child.id)}
          >
            <Image className="w-4 h-4" />
            {t.viewAlbum}
          </Button>
        </div>
      </div>
    </Card>
  );
};