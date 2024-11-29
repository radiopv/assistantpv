import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ImageCropDialog } from "@/components/ImageCrop/ImageCropDialog";
import { ProfilePhotoUpload } from "./ProfilePhotoUpload";
import { useAuth } from "@/components/Auth/AuthProvider";

interface ProfilePhotoSectionProps {
  child: any;
  editing: boolean;
  onPhotoUpdate: (url: string) => void;
}

export const ProfilePhotoSection = ({ child, editing, onPhotoUpdate }: ProfilePhotoSectionProps) => {
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const { user } = useAuth();
  const isStaff = user?.role === 'admin' || user?.role === 'assistant';
  const isSponsor = user?.role === 'sponsor';

  const handlePhotoClick = () => {
    if (editing && child.photo_url && isStaff) {
      setCropDialogOpen(true);
    }
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    try {
      const fileExt = "jpg";
      const filePath = `${child.id}/${Math.random()}.${fileExt}`;

      if (child.photo_url) {
        const oldPath = child.photo_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('children-photos')
            .remove([oldPath]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('children-photos')
        .upload(filePath, croppedImageBlob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('children-photos')
        .getPublicUrl(filePath);

      onPhotoUpdate(publicUrl);
    } catch (error) {
      console.error('Error updating photo:', error);
    }
    setCropDialogOpen(false);
  };

  return (
    <>
      <div 
        className={`aspect-video relative rounded-lg overflow-hidden ${editing && isStaff ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
        onClick={handlePhotoClick}
      >
        <img
          src={child.photo_url || "/placeholder.svg"}
          alt={child.name}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />
      </div>

      {(editing && isStaff) && (
        <ProfilePhotoUpload
          childId={child.id}
          currentPhotoUrl={child.photo_url}
          onUploadComplete={onPhotoUpdate}
        />
      )}

      {(isSponsor && child.is_sponsored) && (
        <ProfilePhotoUpload
          childId={child.id}
          currentPhotoUrl={child.photo_url}
          onUploadComplete={onPhotoUpdate}
        />
      )}

      <ImageCropDialog
        open={cropDialogOpen}
        onClose={() => setCropDialogOpen(false)}
        imageSrc={child.photo_url || ""}
        onCropComplete={handleCropComplete}
      />
    </>
  );
};