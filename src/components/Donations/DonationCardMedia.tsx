import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PhotoUpload } from "./PhotoUpload";
import { VideoUpload } from "./VideoUpload";
import { ImageCropDialog } from "@/components/ImageCrop/ImageCropDialog";
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
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [showCropDialog, setShowCropDialog] = useState(false);
  const { toast } = useToast();

  const handlePhotoSelect = (files: FileList) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setShowCropDialog(true);
    };
    reader.readAsDataURL(file);
  };

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

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    try {
      const fileExt = "jpg";
      const filePath = `${donationId}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('donation-photos')
        .upload(filePath, croppedImageBlob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('donation-photos')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('donation_photos')
        .insert({
          donation_id: donationId,
          url: publicUrl,
        });

      if (dbError) throw dbError;

      toast({
        title: "Photo ajoutée",
        description: "La photo a été ajoutée avec succès.",
      });

      onPhotosUpdate();
      setShowCropDialog(false);
      setShowPhotoUpload(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'upload de la photo.",
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
        <PhotoUpload
          donationId={donationId}
          onPhotosChange={handlePhotoSelect}
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

      <ImageCropDialog
        open={showCropDialog}
        onClose={() => setShowCropDialog(false)}
        imageSrc={selectedImage}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
};