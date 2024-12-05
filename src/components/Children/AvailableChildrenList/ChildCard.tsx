import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { differenceInYears, parseISO } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Need } from "@/types/needs";

interface ChildCardProps {
  child: {
    id: string;
    name: string;
    birth_date: string;
    city: string;
    photo_url: string;
    description?: string;
    needs?: Need[];
    gender: string;
  };
  onViewProfile: (id: string) => void;
}

export const ChildCard = ({ child, onViewProfile }: ChildCardProps) => {
  const { t } = useLanguage();
  const age = differenceInYears(new Date(), parseISO(child.birth_date));

  return (
    <Card className="overflow-hidden group">
      <div className="relative">
        <img
          src={child.photo_url || "/placeholder.svg"}
          alt={child.name}
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{child.name}</h3>
          <div className="mt-1 text-sm text-gray-600">
            <p>{age} {t("years")}</p>
            <p>{child.city}</p>
            <p>{child.gender === 'M' ? t("masculine") : t("feminine")}</p>
          </div>
        </div>

        {child.needs && child.needs.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">{t("needs")}</h4>
            <div className="flex flex-wrap gap-2">
              {child.needs.map((need, index) => (
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

        {child.description && (
          <div>
            <h4 className="font-medium mb-2">{t("description")}</h4>
            <ScrollArea className="h-24">
              <p className="text-sm text-gray-600">{child.description}</p>
            </ScrollArea>
          </div>
        )}

        <Button 
          className="w-full"
          onClick={() => onViewProfile(child.id)}
        >
          {t("becomeSponsor")}
        </Button>
      </div>
    </Card>
  );
};