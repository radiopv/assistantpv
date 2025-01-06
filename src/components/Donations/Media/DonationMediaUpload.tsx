import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface DonationMediaUploadProps {
  donationId: string;
  onUploadComplete?: () => void;
}

export const DonationMediaUpload = ({ donationId, onUploadComplete }: DonationMediaUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { language } = useLanguage();

  const translations = {
    fr: {
      addPhotos: "Ajouter des photos/vidéos",
      uploadInProgress: "Upload en cours...",
      uploadComplete: "Upload terminé avec succès",
      uploadError: "Erreur lors de l'upload. Veuillez réessayer.",
      chooseFiles: "Choisir des fichiers"
    },
    es: {
      addPhotos: "Agregar fotos/videos",
      uploadInProgress: "Subida en curso...",
      uploadComplete: "Subida completada con éxito",
      uploadError: "Error durante la subida. Por favor, inténtelo de nuevo.",
      chooseFiles: "Elegir archivos"
    }
  };

  const t = translations[language as keyof typeof translations];

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;

      setUploading(true);
      setProgress(0);
      const files = Array.from(event.target.files);
      const totalFiles = files.length;
      let completedFiles = 0;

      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const filePath = `${donationId}/${Math.random()}.${fileExt}`;
        const isVideo = file.type.startsWith('video/');
        const bucket = isVideo ? 'donation-videos' : 'donation-photos';

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        const table = isVideo ? 'donation_videos' : 'donation_photos';
        await supabase.from(table).insert({
          donation_id: donationId,
          url: publicUrl,
          mime_type: file.type
        });

        completedFiles++;
        setProgress((completedFiles / totalFiles) * 100);
      });

      await Promise.all(uploadPromises);
      toast.success(t.uploadComplete);
      onUploadComplete?.();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(t.uploadError);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="media-upload">{t.addPhotos}</Label>
      <Input
        id="media-upload"
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleUpload}
        disabled={uploading}
      />
      <Button disabled={uploading}>
        <Upload className="w-4 h-4 mr-2" />
        {uploading ? t.uploadInProgress : t.chooseFiles}
      </Button>

      {uploading && (
        <Progress value={progress} className="w-full" />
      )}
    </div>
  );
};