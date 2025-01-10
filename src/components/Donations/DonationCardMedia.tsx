import { PhotoGrid } from "./Media/PhotoGrid";
import { VideoGrid } from "./Media/VideoGrid";
import { useDonationMedia } from "./hooks/useDonationMedia";

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

  return (
    <div className="space-y-4">
      <PhotoGrid 
        photos={donationPhotos || []} 
        onPhotoDelete={isPublicView ? undefined : () => onPhotosUpdate()}
        onToggleFavorite={isPublicView ? undefined : (id, status) => {
          // Handle favorite toggle
          onPhotosUpdate();
        }}
      />
      <VideoGrid videos={videos} />
    </div>
  );
};