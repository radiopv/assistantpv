import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PhotoUploadProps {
  donationId?: string;
  sponsorId?: string;
  bucketName?: string;
  onUploadComplete?: () => void;
  onPhotosChange?: (files: FileList) => void;
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
  const { language } = useLanguage();

  const translations = {
    fr: {
      addPhotos: "Sélectionner des photos",
      noFileSelected: "Aucun fichier n'a été sélectionné",
      uploading: "Upload en cours...",
      photosAdded: "Photos ajoutées",
      photosAddedSuccess: "Les photos ont été ajoutées avec succès.",
      error: "Erreur",
      uploadError: "Une erreur est survenue lors de l'upload."
    },
    es: {
      addPhotos: "Seleccionar fotos",
      noFileSelected: "Ningún archivo seleccionado",
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

      for (const file of files) {
        completedFiles++;
        setProgress((completedFiles / totalFiles) * 100);
      }

      onUploadComplete?.();
      setProgress(0);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
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