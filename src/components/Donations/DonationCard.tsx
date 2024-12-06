import { Card } from "@/components/ui/card";
import { DonationDialog } from "./DonationDialog";
import { DonationDetails } from "./DonationDetails";
import { DonationCardHeader } from "./DonationCardHeader";
import { DonationCardMedia } from "./DonationCardMedia";
import { useAuth } from "@/components/Auth/AuthProvider";
import { useDonationDelete } from "./hooks/useDonationDelete";
import { useDonationMedia } from "./hooks/useDonationMedia";
import { useDonationEdit } from "./hooks/useDonationEdit";
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
  onDelete?: () => void;
  isAdmin?: boolean;
  canDelete?: boolean;
}

export const DonationCard = ({ 
  donation, 
  onDelete, 
  isAdmin = false
}: DonationCardProps) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { handleDelete } = useDonationDelete(onDelete);
  const { photos, videos, refetchPhotos, refetchVideos } = useDonationMedia(donation.id);
  const { showEditDialog, setShowEditDialog, handleSaveEdit } = useDonationEdit();

  const translations = {
    fr: {
      comments: "Commentaires"
    },
    es: {
      comments: "Comentarios"
    }
  };

  const t = translations[language as keyof typeof translations];

  const userCanDelete = user?.role === 'admin' || user?.role === 'assistant';

  return (
    <Card className="p-4 w-full max-w-full overflow-hidden">
      <div className="space-y-4 w-full">
        <DonationCardHeader
          donation={donation}
          isAdmin={isAdmin}
          canDelete={userCanDelete}
          onEdit={() => setShowEditDialog(true)}
          onDelete={() => handleDelete(donation.id)}
        />

        <DonationDetails donation={donation} />
        
        {donation.comments && (
          <div className="w-full">
            <p className="text-gray-500">{t.comments}</p>
            <p className="text-sm break-words">{donation.comments}</p>
          </div>
        )}

        <DonationCardMedia
          donationId={donation.id}
          photos={photos}
          videos={videos}
          onPhotosUpdate={refetchPhotos}
          onVideosUpdate={refetchVideos}
        />

        <DonationDialog
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          donation={donation}
          onSave={handleSaveEdit}
        />
      </div>
    </Card>
  );
};