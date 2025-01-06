import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface PhotoUploadProps {
  donationId?: string;
  sponsorId?: string;
  bucketName?: string;
  onUploadComplete?: () => void;
  onPhotosChange?: (files: FileList | null) => void;
}

export const PhotoUpload = ({ 
  donationId, 
  sponsorId,
  bucketName = 'donation-photos',
  onUploadComplete, 
  onPhotosChange 
}: PhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const { language } = useLanguage();

  const translations = {
    fr: {
      addPhotos: "Ajouter des photos",
      noFileSelected: "Aucun fichier n'a été sélectionné",
      chooseFiles: "Choisir des fichiers",
      upload: "Upload",
      uploading: "Upload en cours...",
      photosAdded: "Photos ajoutées",
      photosAddedSuccess: "Les photos ont été ajoutées avec succès.",
      error: "Erreur",
      uploadError: "Une erreur est survenue lors de l'upload."
    },
    es: {
      addPhotos: "Agregar fotos",
      noFileSelected: "Ningún archivo seleccionado",
      chooseFiles: "Seleccionar archivos",
      upload: "Subir",
      uploading: "Subiendo...",
      photosAdded: "Fotos agregadas",
      photosAddedSuccess: "Las fotos se han agregado con éxito.",
      error: "Error",
      uploadError: "Ocurrió un error durante la subida."
    }
  };

  const t = translations[language as keyof typeof translations];

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        toast({
          variant: "destructive",
          title: t.error,
          description: t.noFileSelected,
        });
        return;
      }

      if (onPhotosChange) {
        onPhotosChange(event.target.files);
        return;
      }

      setUploading(true);
      setProgress(0);
      const files = Array.from(event.target.files);
      const totalFiles = files.length;
      let completedFiles = 0;

      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const filePath = `${sponsorId || donationId}/${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        if (sponsorId) {
          const { error: updateError } = await supabase
            .from('sponsors')
            .update({ photo_url: publicUrl })
            .eq('id', sponsorId);

          if (updateError) throw updateError;
        } else if (donationId) {
          const { error: dbError } = await supabase
            .from('donation_photos')
            .insert({
              donation_id: donationId,
              url: publicUrl,
            });

          if (dbError) throw dbError;
        }

        completedFiles++;
        setProgress((completedFiles / totalFiles) * 100);
        return publicUrl;
      });

      await Promise.all(uploadPromises);

      toast({
        title: t.photosAdded,
        description: t.photosAddedSuccess,
      });

      onUploadComplete?.();
      setProgress(0);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t.error,
        description: t.uploadError,
      });
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="photo">{t.addPhotos}</Label>
      <Input
        id="photo"
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        disabled={uploading}
        className="cursor-pointer"
      />
      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full h-2" />
          <p className="text-sm text-gray-500 text-center">
            {t.uploading} ({Math.round(progress)}%)
          </p>
        </div>
      )}
    </div>
  );
};