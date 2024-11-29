import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Video, X } from "lucide-react";
import { PhotoUpload } from "./PhotoUpload";
import { VideoUpload } from "./VideoUpload";
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
      {/* Photos Grid */}
      {photos && photos.length > 0 && (
        <div>
          <p className="text-gray-500 mb-2">Photos</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group aspect-square">
                <img
                  src={photo.url}
                  alt="Photo du don"
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos Grid */}
      {videos && videos.length > 0 && (
        <div>
          <p className="text-gray-500 mb-2">Vidéos</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="relative group aspect-video">
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt="Miniature vidéo"
                    className="w-full h-full object-cover rounded-md cursor-pointer"
                    onClick={() => window.open(video.url, '_blank')}
                  />
                ) : (
                  <div 
                    className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center cursor-pointer"
                    onClick={() => window.open(video.url, '_blank')}
                  >
                    <span className="text-sm text-gray-600">Voir la vidéo</span>
                  </div>
                )}
                <button
                  onClick={() => onVideosUpdate()}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* Image Crop Dialog */}
      <ImageCropDialog
        open={showCropDialog}
        onClose={() => setShowCropDialog(false)}
        imageSrc={selectedImage}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
};