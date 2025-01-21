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
    <div className="space-y-6">
      <PhotoGrid 
        photos={photos || []} 
        onPhotoDelete={!isPublicView && canManagePhotos ? () => onPhotosUpdate() : undefined}
        onToggleFavorite={!isPublicView && canManagePhotos ? (id, status) => {
          onPhotosUpdate();
        } : undefined}
        className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 md:gap-4"
      />
      <VideoGrid 
        videos={videos}
        className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 md:gap-4" 
      />
    </div>
  );
};