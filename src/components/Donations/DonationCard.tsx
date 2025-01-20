import { Card } from "@/components/ui/card";
import { DonationCardHeader } from "./DonationCardHeader";
import { DonationCardMedia } from "./DonationCardMedia";
import { DonationDetails } from "./DonationDetails";
import { DonorInfo } from "./DonorInfo";
import { DeleteDonationDialog } from "./Dialogs/DeleteDonationDialog";
import { useState } from "react";
import { useDeleteDonation } from "./hooks/useDeleteDonation";

interface DonationCardProps {
  donation: any;
  onDelete?: () => void;
  canDelete?: boolean;
  isPublicView?: boolean;
}

export const DonationCard = ({ donation, onDelete, canDelete = false, isPublicView = false }: DonationCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteDonation, isDeleting } = useDeleteDonation();

  const handleDelete = async () => {
    await deleteDonation(donation.id);
    setShowDeleteDialog(false);
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <>
      <Card className="overflow-hidden rounded-none md:rounded-lg break-words bg-white/80 backdrop-blur-sm border border-cuba-warmBeige hover:shadow-lg transition-all duration-300">
        <DonationCardHeader 
          donation={donation} 
          onDeleteClick={canDelete ? () => setShowDeleteDialog(true) : undefined}
        />
        <div className="p-4 md:p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <DonationDetails donation={donation} />
              <DonorInfo donors={donation.donors || []} />
            </div>
          </div>
          <DonationCardMedia
            donationId={donation.id}
            donationPhotos={donation.photos || []}
            videos={[]}
            onPhotosUpdate={() => {}}
            isPublicView={isPublicView}
          />
        </div>
      </Card>

      <DeleteDonationDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};