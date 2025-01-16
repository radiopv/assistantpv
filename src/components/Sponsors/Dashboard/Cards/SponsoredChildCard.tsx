import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, FileEdit, Clock } from "lucide-react";
import { useState } from "react";
import { TerminationDialog } from "../TerminationDialog";
import { differenceInDays, format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { convertJsonToNeeds } from "@/types/needs";

interface SponsoredChildCardProps {
  child: {
    id: string;
    name: string;
    photo_url?: string;
    birth_date?: string;
    description?: string;
    needs?: any;
  };
  sponsorshipId: string;
  onAddPhoto: () => void;
  onAddTestimonial: () => void;
}

export const SponsoredChildCard = ({
  child,
  sponsorshipId,
  onAddPhoto,
  onAddTestimonial,
}: SponsoredChildCardProps) => {
  const [showTermination, setShowTermination] = useState(false);

  const calculateDaysUntilBirthday = (birthDate: string) => {
    const today = new Date();
    const birth = parseISO(birthDate);
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    return differenceInDays(nextBirthday, today);
  };

  const formattedBirthDate = child.birth_date 
    ? format(parseISO(child.birth_date), 'dd MMMM yyyy', { locale: fr })
    : null;

  const daysUntilBirthday = child.birth_date 
    ? calculateDaysUntilBirthday(child.birth_date)
    : null;

  const needs = convertJsonToNeeds(child.needs || []);

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border border-cuba-softOrange/20">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Photo et informations de base */}
        <div className="flex items-start space-x-4 md:w-1/3">
          <Avatar className="h-16 w-16">
            <AvatarImage src={child.photo_url} alt={child.name} />
            <AvatarFallback>{child.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{child.name}</h3>
            {formattedBirthDate && (
              <p className="text-sm text-gray-600">
                Né(e) le {formattedBirthDate}
              </p>
            )}
            {daysUntilBirthday !== null && (
              <p className="text-sm text-cuba-coral mt-1">
                {daysUntilBirthday === 0 
                  ? "C'est son anniversaire aujourd'hui !" 
                  : `Anniversaire dans ${daysUntilBirthday} jours`}
              </p>
            )}
          </div>
        </div>

        {/* Description et besoins */}
        <div className="flex-grow space-y-4">
          {child.description && (
            <div className="bg-white/60 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-2 text-cuba-warmGray">Description</h4>
              <p className="text-sm text-gray-700">{child.description}</p>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-medium text-sm text-cuba-warmGray">Besoins</h4>
            <div className="flex flex-wrap gap-2">
              {needs.map((need: any, index: number) => (
                <Badge
                  key={`${need.category}-${index}`}
                  variant={need.is_urgent ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {need.category}
                  {need.is_urgent && " (!)"} 
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex flex-col space-y-2 mt-6">
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 bg-white hover:bg-cuba-warmBeige/10 transition-colors"
          onClick={onAddPhoto}
        >
          <Camera className="h-4 w-4" />
          <span>Ajouter une photo</span>
        </Button>

        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 bg-white hover:bg-cuba-warmBeige/10 transition-colors"
          onClick={onAddTestimonial}
        >
          <FileEdit className="h-4 w-4" />
          <span>Ajouter un témoignage</span>
        </Button>

        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 bg-white hover:bg-cuba-warmBeige/10 transition-colors"
          onClick={() => setShowTermination(true)}
        >
          <Clock className="h-4 w-4" />
          <span>Mettre fin au parrainage</span>
        </Button>
      </div>

      <TerminationDialog
        isOpen={showTermination}
        onClose={() => setShowTermination(false)}
        sponsorshipId={sponsorshipId}
        childName={child.name}
        onTerminationComplete={() => window.location.reload()}
      />
    </Card>
  );
};