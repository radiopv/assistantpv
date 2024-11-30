import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { differenceInMonths, differenceInYears, parseISO } from "date-fns";
import { Globe } from "lucide-react";
import { useState } from "react";

interface ChildrenListProps {
  children: any[];
  isLoading: boolean;
  onViewProfile: (id: string) => void;
}

const translations = {
  fr: {
    months: "mois",
    years: "ans",
    viewProfile: "Voir le profil",
    available: "Disponible",
  },
  es: {
    months: "meses",
    years: "años",
    viewProfile: "Ver perfil",
    available: "Disponible",
  }
};

const formatAge = (birthDate: string, language: string) => {
  const today = new Date();
  const birth = parseISO(birthDate);
  const years = differenceInYears(today, birth);
  
  if (years === 0) {
    const months = differenceInMonths(today, birth);
    return `${months} ${translations[language].months}`;
  }
  
  return `${years} ${translations[language].years}`;
};

export const ChildrenList = ({ children, isLoading, onViewProfile }: ChildrenListProps) => {
  const [language, setLanguage] = useState<"fr" | "es">("fr");

  const toggleLanguage = () => {
    setLanguage(prev => prev === "fr" ? "es" : "fr");
  };

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

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleLanguage}
          className="flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          {language.toUpperCase()}
        </Button>
      </div>
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
                <p>{formatAge(child.birth_date, language)}</p>
                <p>{child.city}</p>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs ${
                    child.status === "Disponible"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {child.status === "Disponible" ? translations[language].available : child.status}
                </span>
              </div>
              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={() => onViewProfile(child.id)}
              >
                {translations[language].viewProfile}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};