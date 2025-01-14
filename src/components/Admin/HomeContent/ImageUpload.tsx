import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageCropDialog } from "@/components/ImageCrop/ImageCropDialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface HomeImage {
  id: string;
  url: string;
  position: string;
}

interface ImageUploadProps {
  heroImage: HomeImage | null;
  isLoading: boolean;
}

const VALID_POSITIONS = ['hero', 'banner', 'background'] as const;
type ValidPosition = typeof VALID_POSITIONS[number];

export const ImageUpload = ({ heroImage, isLoading }: ImageUploadProps) => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
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
      const filename = `hero-${Date.now()}.jpg`;
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

      const position: ValidPosition = 'hero';
      
      // First try to update existing record
      const { error: updateError } = await supabase
        .from('home_images')
        .update({ 
          url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('position', position);

      // If no record exists to update, insert a new one
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

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Image Hero</h2>
      
      {heroImage?.url && (
        <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
          <img
            src={heroImage.url}
            alt="Hero actuelle"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="space-y-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          disabled={uploadingImage}
          className="mb-4"
        />
        <p className="text-sm text-gray-500">
          Format recommandé : 1920x1080px, JPG ou PNG, max 5MB
        </p>
        {uploadingImage && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Upload en cours...
          </div>
        )}
      </div>

      {selectedImage && (
        <ImageCropDialog
          open={cropDialogOpen}
          onClose={() => setCropDialogOpen(false)}
          imageSrc={URL.createObjectURL(selectedImage)}
          onCropComplete={handleCropComplete}
        />
      )}
    </Card>
  );
};