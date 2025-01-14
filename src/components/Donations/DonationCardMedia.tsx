import { PhotoGrid } from "./Media/PhotoGrid";
import { VideoGrid } from "./Media/VideoGrid";
import { useDonationMedia } from "./hooks/useDonationMedia";
import { useAuth } from "@/components/Auth/AuthProvider";

interface DonationCardMediaProps {
  donationId: string;
  photos: any[];
  videos: any[];
  onPhotosUpdate: () => void;
  onVideosUpdate: () => void;
  isPublicView?: boolean;
}

export const DonationCardMedia = ({
  donationId,
  photos,
  videos,
  onPhotosUpdate,
  onVideosUpdate,
  isPublicView = false,
}: DonationCardMediaProps) => {
  const { photos: donationPhotos } = useDonationMedia(donationId);
  const { user } = useAuth();

  const canManagePhotos = user?.role === 'admin' || user?.role === 'assistant';

  return (
    <div className="space-y-4">
      <PhotoGrid 
        photos={donationPhotos || []} 
        onPhotoDelete={!isPublicView && canManagePhotos ? () => onPhotosUpdate() : undefined}
        onToggleFavorite={!isPublicView && canManagePhotos ? (id, status) => {
          onPhotosUpdate();
        } : undefined}
      />
      <VideoGrid videos={videos} />
    </div>
  );
};