import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UseImageUploadProps {
  position: string;
  onUploadComplete?: () => void;
}

export const useImageUpload = ({ position, onUploadComplete }: UseImageUploadProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 5MB");
        return;
      }
      setSelectedImage(file);
      setCropDialogOpen(true);
    }
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    setCropDialogOpen(false);
    setUploadingImage(true);

    try {
      const filename = `${position}-${Date.now()}.jpg`;
      console.log("Uploading image:", filename);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('home-images')
        .upload(filename, croppedImageBlob);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log("Upload successful:", uploadData);

      const { data: { publicUrl } } = supabase.storage
        .from('home-images')
        .getPublicUrl(filename);

      console.log("Public URL:", publicUrl);
      
      const { error: updateError } = await supabase
        .from('home_images')
        .update({ 
          url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('position', position);

      if (updateError) {
        console.log("No existing record, creating new one");
        const { error: insertError } = await supabase
          .from('home_images')
          .insert({
            url: publicUrl,
            position,
            updated_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }

      toast.success("Image mise à jour avec succès");
      onUploadComplete?.();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Une erreur est survenue lors de la mise à jour de l'image");
    } finally {
      setUploadingImage(false);
      setSelectedImage(null);
    }
  };

  return {
    selectedImage,
    cropDialogOpen,
    setCropDialogOpen,
    uploadingImage,
    handleImageSelect,
    handleCropComplete,
  };
};