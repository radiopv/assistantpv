import { PhotoGrid } from "./Media/PhotoGrid";
import { VideoGrid } from "./Media/VideoGrid";

interface DonationCardMediaProps {
  donationId: string;
  photos: any[];
  videos: any[];
  onPhotosUpdate: () => void;
  onVideosUpdate: () => void;
}

export const DonationCardMedia = ({
  photos,
  videos,
  onPhotosUpdate,
  onVideosUpdate,
}: DonationCardMediaProps) => {
  return (
    <div className="space-y-4">
      <PhotoGrid 
        photos={photos} 
        onPhotoDelete={() => onPhotosUpdate()}
        onToggleFavorite={(id, status) => {
          // Handle favorite toggle
          onPhotosUpdate();
        }}
      />
      <VideoGrid videos={videos} />
    </div>
  );
};