import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";
import { ImageCropDialog } from "@/components/ImageCrop/ImageCropDialog";

interface ProfilePhotoUploadProps {
  childId: string;
  currentPhotoUrl?: string | null;
  onUploadComplete: (url: string) => void;
}

export const ProfilePhotoUpload = ({ childId, currentPhotoUrl, onUploadComplete }: ProfilePhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Le fichier ne doit pas dépasser 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Erreur lors de la lecture du fichier:", error);
      toast.error("Erreur lors de la lecture du fichier");
    }
  };

  const handleUpload = async (croppedImageBlob: Blob) => {
    try {
      setUploading(true);
      setCropDialogOpen(false);

      const fileExt = "jpg";
      const filePath = `${childId}/${Math.random()}.${fileExt}`;

      if (currentPhotoUrl) {
        const oldPath = currentPhotoUrl.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('children-photos')
            .remove([oldPath]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('children-photos')
        .upload(filePath, croppedImageBlob);

      if (uploadError) {
        console.error("Erreur upload:", uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('children-photos')
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl);

      toast.success("Photo mise à jour avec succès");
    } catch (error) {
      console.error("Erreur complète:", error);
      toast.error("Une erreur est survenue lors de l'upload de la photo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="profile-photo">Photo de profil</Label>
      <Input
        id="profile-photo"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
      />
      <Button disabled={uploading}>
        <Upload className="w-4 h-4 mr-2" />
        {uploading ? "Upload en cours..." : "Changer la photo"}
      </Button>

      <ImageCropDialog
        open={cropDialogOpen}
        onClose={() => setCropDialogOpen(false)}
        imageSrc={selectedImage}
        onCropComplete={handleUpload}
        aspectRatio={1}
      />
    </div>
  );
};