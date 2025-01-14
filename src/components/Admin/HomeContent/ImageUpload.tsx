import { Card } from "@/components/ui/card";
import { ImageCropDialog } from "@/components/ImageCrop/ImageCropDialog";
import { ImagePreview } from "./Image/ImagePreview";
import { ImageUploadInput } from "./Image/ImageUploadInput";
import { useImageUpload } from "./Image/useImageUpload";

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
  const {
    selectedImage,
    cropDialogOpen,
    setCropDialogOpen,
    uploadingImage,
    handleImageSelect,
    handleCropComplete,
  } = useImageUpload({
    position: 'hero'
  });

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Image Hero</h2>
      
      <ImagePreview 
        url={heroImage?.url} 
        isLoading={isLoading} 
      />

      <ImageUploadInput 
        onImageSelect={handleImageSelect}
        isUploading={uploadingImage}
      />

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