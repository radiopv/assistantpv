import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PhotoUploadDialog } from "./Media/PhotoUploadDialog";
import { VideoUpload } from "./VideoUpload";
import { PhotoGrid } from "./Media/PhotoGrid";
import { VideoGrid } from "./Media/VideoGrid";
import { UploadButtons } from "./Media/UploadButtons";

interface DonationCardMediaProps {
  donationId: string;
  photos: any[];
  videos: any[];
  onPhotosUpdate: () => void;
  onVideosUpdate: () => void;
}

export const DonationCardMedia = ({
  donationId,
  photos,
  videos,
  onPhotosUpdate,
  onVideosUpdate,
}: DonationCardMediaProps) => {
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const { toast } = useToast();

  const handleDeletePhoto = async (photoId: number) => {
    try {
      const { error } = await supabase
        .from('donation_photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;

      toast({
        title: "Photo supprimée",
        description: "La photo a été supprimée avec succès.",
      });

      onPhotosUpdate();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la photo.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <PhotoGrid photos={photos} onDeletePhoto={handleDeletePhoto} />
      <VideoGrid videos={videos} onVideosUpdate={onVideosUpdate} />

      <UploadButtons
        showPhotoUpload={showPhotoUpload}
        showVideoUpload={showVideoUpload}
        onPhotoUploadClick={() => setShowPhotoUpload(!showPhotoUpload)}
        onVideoUploadClick={() => setShowVideoUpload(!showVideoUpload)}
      />

      {showPhotoUpload && (
        <PhotoUploadDialog
          donationId={donationId}
          onUploadComplete={() => {
            onPhotosUpdate();
            setShowPhotoUpload(false);
          }}
        />
      )}

      {showVideoUpload && (
        <VideoUpload
          donationId={donationId}
          onUploadComplete={() => {
            onVideosUpdate();
            setShowVideoUpload(false);
          }}
        />
      )}
    </div>
  );
};
