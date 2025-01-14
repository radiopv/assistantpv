import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImagePlus, MessageSquarePlus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

interface SponsoredChildCardProps {
  child: {
    name: string;
    photo_url: string | null;
    city: string | null;
    age?: number;
  };
  onAddPhoto: () => void;
  onAddTestimonial: () => void;
}

export const SponsoredChildCard = ({ 
  child, 
  onAddPhoto,
  onAddTestimonial 
}: SponsoredChildCardProps) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const translations = {
    fr: {
      addPhoto: "Ajouter une photo",
      addTestimonial: "Ajouter un témoignage",
      years: "ans"
    },
    es: {
      addPhoto: "Agregar una foto",
      addTestimonial: "Agregar testimonio",
      years: "años"
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <Card className="p-4 bg-white shadow-sm w-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 rounded-full border-2 border-cuba-warmBeige">
            <AvatarImage src={child.photo_url || undefined} alt={child.name} />
            <AvatarFallback>{child.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">{child.name}</h3>
            {child.age && (
              <p className="text-gray-600">{child.age} {t.years}</p>
            )}
            {child.city && (
              <p className="text-gray-600 text-sm">{child.city}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col w-full gap-3">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-gray-50"
            onClick={onAddPhoto}
          >
            <ImagePlus className="w-4 h-4" />
            {t.addPhoto}
          </Button>
          
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-gray-50"
            onClick={onAddTestimonial}
          >
            <MessageSquarePlus className="w-4 h-4" />
            {t.addTestimonial}
          </Button>
        </div>
      </div>
    </Card>
  );
};