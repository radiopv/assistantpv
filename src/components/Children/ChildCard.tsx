import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { convertJsonToNeeds } from "@/types/needs";
import { translateNeedCategory } from "@/utils/needsTranslation";

interface ChildCardProps {
  child: any;
  onViewProfile: (id: string) => void;
  onSponsorClick: (child: any) => void;
}

export const ChildCard = ({ child, onViewProfile, onSponsorClick }: ChildCardProps) => {
  const { t } = useLanguage();

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative pb-[75%] bg-gray-100">
        <img
          src={child.photo_url || "/placeholder.svg"}
          alt={child.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex-grow space-y-2">
          <h3 className="text-lg font-semibold line-clamp-1">{child.name}</h3>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 line-clamp-1">{child.age} ans</p>
            <p className="text-sm text-gray-600 line-clamp-1">{child.city}</p>
          </div>
          {child.needs && (
            <div className="flex flex-col gap-1.5">
              {convertJsonToNeeds(child.needs).map((need: any, index: number) => (
                <div
                  key={`${need.category}-${index}`}
                  className={`p-2 rounded-lg ${
                    need.is_urgent 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100'
                  }`}
                >
                  <div className="text-sm font-medium">
                    {translateNeedCategory(need.category)}
                    {need.is_urgent && " (!)"} 
                  </div>
                  {need.description && (
                    <p className="text-sm mt-1 opacity-90">
                      {need.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-2 mt-3">
          <Button
            onClick={() => onViewProfile(child.id)}
            className="w-full"
            variant="secondary"
          >
            {t("viewProfile")}
          </Button>
          {!child.is_sponsored && (
            <Button
              onClick={() => onSponsorClick(child)}
              className="w-full"
            >
              {t("sponsor")}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};