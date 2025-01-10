import { Card } from "@/components/ui/card";
import { DonationDetails } from "./DonationDetails";
import { DonationCardHeader } from "./DonationCardHeader";
import { DonationCardMedia } from "./DonationCardMedia";
import { useDonationMedia } from "./hooks/useDonationMedia";
import { useLanguage } from "@/contexts/LanguageContext";
import { RefetchOptions } from "@tanstack/react-query";
import { motion } from "framer-motion";

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
  onDelete?: (options?: RefetchOptions) => Promise<unknown>;
  canDelete?: boolean;
}

export const DonationCard = ({ donation, onDelete, canDelete }: DonationCardProps) => {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300 border-cuba-turquoise/20 group-hover:border-cuba-turquoise/40">
        <div className="p-6 space-y-6">
          <DonationCardHeader donation={donation} />

          <div className="border-t border-cuba-turquoise/10 pt-4">
            <DonationDetails donation={donation} />
          </div>
          
          {donation.comments && (
            <div className="border-t border-cuba-turquoise/10 pt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">{t.comments}</h4>
              <p className="text-sm text-gray-700 leading-relaxed">{donation.comments}</p>
            </div>
          )}

          {(photos.length > 0 || videos.length > 0) && (
            <div className="border-t border-cuba-turquoise/10 pt-4">
              <DonationCardMedia
                donationId={donation.id}
                photos={photos}
                videos={videos}
                onPhotosUpdate={() => {}}
                onVideosUpdate={() => {}}
              />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};