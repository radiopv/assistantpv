import { PhotoGrid } from "./Media/PhotoGrid";
import { VideoGrid } from "./Media/VideoGrid";
import { useDonationMedia } from "./hooks/useDonationMedia";
import { useAuth } from "@/components/Auth/AuthProvider";

interface DonationCardMediaProps {
  donationId: string;
  donationPhotos?: {
    id: string;
    url: string;
    title?: string;
    is_featured?: boolean;
  }[];
  videos?: {
    id: string;
    url: string;
    title?: string;
    description?: string;
    thumbnail_url?: string;
  }[];
  onPhotosUpdate?: () => void;
  isPublicView?: boolean;
}

export const DonationCardMedia = ({
  donationId,
  donationPhotos = [],
  videos = [],
  onPhotosUpdate = () => {},
  isPublicView = false,
}: DonationCardMediaProps) => {
  const { photos } = useDonationMedia(donationId);
  const { user } = useAuth();

  const canManagePhotos = user?.role === 'admin' || user?.role === 'assistant';

  return (
    <div className="space-y-4">
      <PhotoGrid 
        photos={photos || []} 
        onPhotoDelete={!isPublicView && canManagePhotos ? () => onPhotosUpdate() : undefined}
        onToggleFavorite={!isPublicView && canManagePhotos ? (id, status) => {
          onPhotosUpdate();
        } : undefined}
      />
      <VideoGrid videos={videos} />
    </div>
  );
};