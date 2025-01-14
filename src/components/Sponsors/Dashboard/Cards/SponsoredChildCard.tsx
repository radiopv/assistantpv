import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImagePlus, MessageSquarePlus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SponsoredChildCardProps {
  child: any;
  onAddPhoto: () => void;
  onAddTestimonial: () => void;
}

export const SponsoredChildCard = ({ 
  child, 
  onAddPhoto,
  onAddTestimonial 
}: SponsoredChildCardProps) => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      addPhoto: "Ajouter une photo",
      addTestimonial: "Ajouter un témoignage",
    },
    es: {
      addPhoto: "Agregar una foto",
      addTestimonial: "Agregar testimonio",
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={child.photo_url} alt={child.name} />
            <AvatarFallback>{child.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">{child.name}</h3>
            <p className="text-gray-600">{child.age} ans</p>
            <p className="text-gray-600">{child.city}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={onAddPhoto}
          >
            <ImagePlus className="w-4 h-4" />
            {t.addPhoto}
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center gap-2"
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