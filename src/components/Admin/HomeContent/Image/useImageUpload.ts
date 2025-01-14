import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseImageUploadProps {
  position: string;
  onUploadComplete?: () => void;
}

export const useImageUpload = ({ position, onUploadComplete }: UseImageUploadProps) => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Fichier trop volumineux",
          description: "L'image ne doit pas dépasser 5MB",
        });
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

      toast({
        title: "Image mise à jour",
        description: "L'image a été mise à jour avec succès",
      });

      onUploadComplete?.();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'image",
      });
    } finally {
      setUploadingImage(false);
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