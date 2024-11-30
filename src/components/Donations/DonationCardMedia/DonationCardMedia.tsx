import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Video, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PhotoUpload } from "../PhotoUpload";
import { VideoUpload } from "../VideoUpload";
import { DonationMediaGrid } from "./DonationMediaGrid";
import { DonationMediaEdit } from "./DonationMediaEdit";

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
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
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
      {/* Media Grids */}
      <DonationMediaGrid 
        photos={photos}
        videos={videos}
        onPhotoSelect={setSelectedPhoto}
        onPhotoDelete={handleDeletePhoto}
        onVideoDelete={onVideosUpdate}
      />

      {/* Upload Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPhotoUpload(!showPhotoUpload)}
          className="flex items-center gap-2"
        >
          <Camera className="w-4 h-4" />
          {showPhotoUpload ? "Fermer" : "Ajouter des photos"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowVideoUpload(!showVideoUpload)}
          className="flex items-center gap-2"
        >
          <Video className="w-4 h-4" />
          {showVideoUpload ? "Fermer" : "Ajouter des vidéos"}
        </Button>
      </div>

      {/* Upload Forms */}
      {showPhotoUpload && (
        <PhotoUpload
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

      {/* Edit Dialog */}
      <DonationMediaEdit
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onSave={onPhotosUpdate}
      />
    </div>
  );
};