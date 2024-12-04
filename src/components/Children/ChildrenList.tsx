import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { differenceInMonths, differenceInYears, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { convertJsonToNeeds } from "@/types/needs";

interface ChildrenListProps {
  children: any[];
  isLoading: boolean;
  onViewProfile: (id: string) => void;
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

export const ChildrenList = ({ children, isLoading, onViewProfile }: ChildrenListProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const NEED_CATEGORIES = {
    education: "Éducation",
    jouet: "Jouet",
    vetement: "Vêtement",
    nourriture: "Nourriture",
    medicament: "Médicament",
    hygiene: "Hygiène",
    autre: "Autre"
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {children.map((child) => (
        <Card key={child.id} className="overflow-hidden">
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
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs ${
                  child.status === "Disponible"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {child.status}
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
            
            <Button 
              className="w-full mt-4" 
              variant="outline"
              onClick={() => onViewProfile(child.id)}
            >
              Voir le profil
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};