import { Card } from "@/components/ui/card";
import { DonationDetails } from "./DonationDetails";
import { DonationCardHeader } from "./DonationCardHeader";
import { DonationCardMedia } from "./DonationCardMedia";
import { useDonationMedia } from "./hooks/useDonationMedia";
import { useLanguage } from "@/contexts/LanguageContext";

interface DonationCardProps {
  donation: {
    id: string;
    assistant_name: string;
    city: string;
    people_helped: number;
    donation_date: string;
    status: string;
    comments: string | null;
  };
}

export const DonationCard = ({ donation }: DonationCardProps) => {
  const { language } = useLanguage();
  const { photos, videos } = useDonationMedia(donation.id);

  const translations = {
    fr: {
      comments: "Commentaires"
    },
    es: {
      comments: "Comentarios"
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <Card className="p-4 w-full max-w-full overflow-hidden">
      <div className="space-y-4 w-full">
        <DonationCardHeader
          donation={donation}
        />

        <DonationDetails donation={donation} />
        
        {donation.comments && (
          <div className="w-full break-words">
            <p className="text-gray-500">{t.comments}</p>
            <p className="text-sm">{donation.comments}</p>
          </div>
        )}

        <DonationCardMedia
          donationId={donation.id}
          photos={photos}
          videos={videos}
          onPhotosUpdate={() => {}}
          onVideosUpdate={() => {}}
        />
      </div>
    </Card>
  );
};