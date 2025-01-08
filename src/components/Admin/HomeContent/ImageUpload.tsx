import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ImageCropDialog } from "@/components/ImageCrop/ImageCropDialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface HomeImage {
  id: string;
  url: string;
  position: string;
}

interface ImageUploadProps {
  heroImage: HomeImage | null;
  isLoading: boolean;
}

export const ImageUpload = ({ heroImage, isLoading }: ImageUploadProps) => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setCropDialogOpen(true);
    }
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    setCropDialogOpen(false);
    setUploadingImage(true);

    try {
      const filename = `hero-${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('home-images')
        .upload(filename, croppedImageBlob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('home-images')
        .getPublicUrl(filename);

      const { error: dbError } = await supabase
        .from('home_images')
        .upsert({
          url: publicUrl,
          position: 'hero',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'position'
        });

      if (dbError) throw dbError;

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
    return <Card className="p-6 animate-pulse bg-gray-100" />;
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
          className="mb-4"
        />
        <p className="text-sm text-gray-500">
          Format recommandé : 1920x1080px, JPG ou PNG
        </p>
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