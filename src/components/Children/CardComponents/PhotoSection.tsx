import { useState } from "react";
import { ProfilePhotoSection } from "../ProfilePhoto/ProfilePhotoSection";
import { ImageCropDialog } from "@/components/ImageCrop/ImageCropDialog";

interface PhotoSectionProps {
  child: any;
  editing: boolean;
  onPhotoUpdate: (url: string) => void;
}

export const PhotoSection = ({ child, editing, onPhotoUpdate }: PhotoSectionProps) => {
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const handleImageClick = () => {
    if (editing && child.photo_url) {
      setSelectedImage(child.photo_url);
      setCropDialogOpen(true);
    }
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    try {
      const fileExt = "jpg";
      const filePath = `${child.id}/${Math.random()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('children-photos')
        .upload(filePath, croppedImageBlob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('children-photos')
        .getPublicUrl(filePath);

      onPhotoUpdate(publicUrl);
      setCropDialogOpen(false);
    } catch (error) {
      console.error('Error updating photo:', error);
      toast.error("Une erreur est survenue lors de la mise à jour de la photo");
    }
  };

  return (
    <div className="relative">
      <ProfilePhotoSection
        child={child}
        editing={editing}
        onPhotoUpdate={onPhotoUpdate}
      />
      {editing ? (
        <div 
          className="cursor-pointer hover:opacity-90 transition-opacity"
          onClick={handleImageClick}
        >
          <img
            src={child.photo_url || "/placeholder.svg"}
            alt={child.name}
            className="w-full h-56 object-cover"
            style={{ objectPosition: '50% 20%' }}
          />
        </div>
      ) : (
        <img
          src={child.photo_url || "/placeholder.svg"}
          alt={child.name}
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
          style={{ objectPosition: '50% 20%' }}
        />
      )}

      <ImageCropDialog
        open={cropDialogOpen}
        onClose={() => setCropDialogOpen(false)}
        imageSrc={selectedImage}
        onCropComplete={handleCropComplete}
        aspectRatio={4/3}
      />
    </div>
  );
};