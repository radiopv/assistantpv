import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { differenceInMonths, differenceInYears, parseISO } from "date-fns";
import { convertJsonToNeeds } from "@/types/needs";

interface ChildCardProps {
  child: any;
  onViewProfile: (id: string) => void;
  onSponsorClick: (child: any) => void;
}

const formatAge = (birthDate: string) => {
  const today = new Date();
  const birth = parseISO(birthDate);
  const years = differenceInYears(today, birth);
  
  if (years === 0) {
    const months = differenceInMonths(today, birth);
    return `${months} mois`;
  }
  
  return `${years} ans`;
};

const NEED_CATEGORIES = {
  education: "Éducation",
  jouet: "Jouet",
  vetement: "Vêtement",
  nourriture: "Nourriture",
  medicament: "Médicament",
  hygiene: "Hygiène",
  autre: "Autre"
};

export const ChildCard = ({ child, onViewProfile, onSponsorClick }: ChildCardProps) => {
  return (
    <Card className="overflow-hidden">
      <img
        src={child.photo_url || "/placeholder.svg"}
        alt={child.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{child.name}</h3>
        <div className="mt-2 space-y-1 text-sm text-gray-600">
          <p>{formatAge(child.birth_date)}</p>
          <p>{child.city}</p>
          {child.is_sponsored && child.sponsor_name && (
            <p className="font-medium text-blue-600">
              Parrainé par: {child.sponsor_name}
            </p>
          )}
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs ${
              !child.is_sponsored
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {child.is_sponsored ? "Parrainé" : "Disponible"}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {convertJsonToNeeds(child.needs).map((need, index) => (
            <Badge 
              key={`${need.category}-${index}`}
              variant={need.is_urgent ? "destructive" : "secondary"}
            >
              {NEED_CATEGORIES[need.category as keyof typeof NEED_CATEGORIES]}
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button 
            className="flex-1" 
            variant="outline"
            onClick={() => onViewProfile(child.id)}
          >
            Voir le profil
          </Button>

          <Button 
            variant="outline"
            onClick={() => onSponsorClick(child)}
          >
            {child.is_sponsored ? "Modifier parrain" : "Ajouter parrain"}
          </Button>
        </div>
      </div>
    </Card>
  );
};