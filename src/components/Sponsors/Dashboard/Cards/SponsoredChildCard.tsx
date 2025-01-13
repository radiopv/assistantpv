import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Album } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { differenceInDays } from "date-fns";

interface SponsoredChildCardProps {
  child: any;
  onViewProfile: () => void;
  onViewAlbum: () => void;
}

export const SponsoredChildCard = ({ 
  child, 
  onViewProfile,
  onViewAlbum 
}: SponsoredChildCardProps) => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      viewProfile: "Voir le profil",
      viewAlbum: "Album photos",
      age: "ans",
      months: "mois",
      birthdayIn: "Anniversaire dans",
      days: "jours"
    },
    es: {
      viewProfile: "Ver perfil",
      viewAlbum: "Álbum de fotos",
      age: "años",
      months: "meses",
      birthdayIn: "Cumpleaños en",
      days: "días"
    }
  };

  const t = translations[language as keyof typeof translations];

  const getBirthdayCountdown = () => {
    if (!child.birth_date) return null;
    
    const today = new Date();
    const birthDate = new Date(child.birth_date);
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    return differenceInDays(nextBirthday, today);
  };

  const daysUntilBirthday = getBirthdayCountdown();

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
            {daysUntilBirthday && (
              <p className="text-cuba-coral mt-1">
                {t.birthdayIn} {daysUntilBirthday} {t.days}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={onViewProfile}
          >
            {t.viewProfile}
          </Button>
          
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={onViewAlbum}
          >
            <Album className="w-4 h-4" />
            {t.viewAlbum}
          </Button>
        </div>
      </div>
    </Card>
  );
};