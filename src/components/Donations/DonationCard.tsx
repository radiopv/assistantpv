import { Card } from "@/components/ui/card";
import { DonationDialog } from "./DonationDialog";
import { DonationDetails } from "./DonationDetails";
import { DonationCardHeader } from "./DonationCardHeader";
import { DonationCardMedia } from "./DonationCardMedia";
import { useAuth } from "@/components/Auth/AuthProvider";
import { useDonationDelete } from "./hooks/useDonationDelete";
import { useDonationMedia } from "./hooks/useDonationMedia";
import { useDonationEdit } from "./hooks/useDonationEdit";

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
  const { handleDelete } = useDonationDelete(onDelete);
  const { photos, videos, refetchPhotos, refetchVideos } = useDonationMedia(donation.id);
  const { showEditDialog, setShowEditDialog, handleSaveEdit } = useDonationEdit();

  // Détermine si l'utilisateur peut supprimer en fonction de son rôle
  const userCanDelete = user?.role === 'admin' || user?.role === 'assistant';

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <DonationCardHeader
          donation={donation}
          isAdmin={isAdmin}
          canDelete={userCanDelete}
          onEdit={() => setShowEditDialog(true)}
          onDelete={() => handleDelete(donation.id)}
        />

        <DonationDetails donation={donation} />
        
        {donation.comments && (
          <div>
            <p className="text-gray-500">Commentaires</p>
            <p className="text-sm">{donation.comments}</p>
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