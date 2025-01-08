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
}: DonationCardMediaProps) => {
  return (
    <div className="space-y-4">
      <PhotoGrid photos={photos} />
      <VideoGrid videos={videos} />
    </div>
  );
};