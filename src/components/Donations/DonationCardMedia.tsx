import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PhotoUpload } from "./PhotoUpload";
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

  const handlePhotoUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const filePath = `${donationId}/${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('donation-photos')
          .upload(filePath, file);

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
        return publicUrl;
      });

      await Promise.all(uploadPromises);

      toast({
        title: "Photos ajoutées",
        description: "Les photos ont été ajoutées avec succès.",
      });

      onPhotosUpdate();
      setShowPhotoUpload(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'upload des photos.",
      });
    }
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
          onUploadComplete={() => {
            onPhotosUpdate();
            setShowPhotoUpload(false);
          }}
          onPhotosChange={handlePhotoUpload}
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