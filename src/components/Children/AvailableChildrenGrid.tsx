import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Need } from "@/types/needs";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

interface AvailableChildrenGridProps {
  children: any[];
  isLoading: boolean;
  onSponsorClick: (childId: string) => void;
}

export const AvailableChildrenGrid = ({ children, isLoading, onSponsorClick }: AvailableChildrenGridProps) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <Card key={n} className="p-4 space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children.map((child) => {
        const childNeeds = Array.isArray(child.needs) ? child.needs : [];
        
        return (
          <Card key={child.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative">
              <img
                src={child.photo_url || "/placeholder.svg"}
                alt={child.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">{child.name}</h3>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{child.age} {t("age")}</span>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{child.city}</span>
              </div>

              {childNeeds.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{t("needs")}:</p>
                  <div className="flex flex-wrap gap-2">
                    {childNeeds.map((need: Need, index: number) => (
                      <Badge 
                        key={`${need.category}-${index}`}
                        variant={need.is_urgent ? "destructive" : "secondary"}
                      >
                        {need.category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                className="w-full" 
                onClick={() => onSponsorClick(child.id)}
              >
                <Heart className="w-4 h-4 mr-2" />
                {t("sponsor")}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};