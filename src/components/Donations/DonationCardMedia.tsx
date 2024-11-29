import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Video } from "lucide-react";
import { PhotoUpload } from "./PhotoUpload";
import { VideoUpload } from "./VideoUpload";
import { DonationMedia } from "./DonationMedia";
import { ImageCropDialog } from "@/components/ImageCrop/ImageCropDialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    <>
      <DonationMedia
        photos={photos}
        videos={videos}
        onPhotoDelete={async (photoId) => {
          await supabase.from('donation_photos').delete().eq('id', photoId);
          onPhotosUpdate();
        }}
        onVideoDelete={async (videoId) => {
          await supabase.from('donation_videos').delete().eq('id', videoId);
          onVideosUpdate();
        }}
      />

      <div className="flex flex-wrap gap-2 mt-4">
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

      {showPhotoUpload && (
        <div className="space-y-4">
          <PhotoUpload
            donationId={donationId}
            onPhotosChange={handlePhotoSelect}
          />
        </div>
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
    </>
  );
};