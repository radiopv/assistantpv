import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface StatisticsSectionProps {
  photos: any[];
  needs: any[];
  sponsorshipDuration: number;
  sponsorshipStartDate: string;
}

export const StatisticsSection = ({ 
  photos, 
  needs, 
  sponsorshipDuration,
  sponsorshipStartDate 
}: StatisticsSectionProps) => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      photos: "Photos",
      totalPhotos: "Total photos",
      lastPhoto: "Dernière photo",
      needs: "Besoins",
      totalNeeds: "Total besoins",
      urgentNeeds: "Besoins urgents",
      duration: "Durée du parrainage",
      days: "jours",
      startDate: "Date de début",
      none: "Aucune"
    },
    es: {
      photos: "Fotos",
      totalPhotos: "Total fotos",
      lastPhoto: "Última foto",
      needs: "Necesidades",
      totalNeeds: "Total necesidades",
      urgentNeeds: "Necesidades urgentes",
      duration: "Duración del apadrinamiento",
      days: "días",
      startDate: "Fecha de inicio",
      none: "Ninguna"
    }
  };

  const t = translations[language as keyof typeof translations];

  const urgentNeedsCount = needs.filter(need => need.is_urgent).length;

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-4 bg-cuba-warmBeige/20">
        <h4 className="font-medium mb-2">{t.photos}</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>{t.totalPhotos}:</span>
            <span className="font-bold">{photos.length}</span>
          </div>
          <div className="flex justify-between">
            <span>{t.lastPhoto}:</span>
            <span className="font-bold">
              {photos[0]?.created_at 
                ? new Date(photos[0].created_at).toLocaleDateString()
                : t.none}
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-cuba-warmBeige/20">
        <h4 className="font-medium mb-2">{t.needs}</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>{t.totalNeeds}:</span>
            <span className="font-bold">{needs.length}</span>
          </div>
          <div className="flex justify-between">
            <span>{t.urgentNeeds}:</span>
            <span className="font-bold text-cuba-coral">
              {urgentNeedsCount}
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-cuba-warmBeige/20 col-span-2">
        <h4 className="font-medium mb-2">{t.duration}</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>{t.duration}:</span>
            <span className="font-bold">
              {sponsorshipDuration} {t.days}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t.startDate}:</span>
            <span className="font-bold">
              {sponsorshipStartDate 
                ? new Date(sponsorshipStartDate).toLocaleDateString()
                : t.none}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};