import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";

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
  const [uploadStatus, setUploadStatus] = useState<'success' | 'error' | null>(null);
  const { toast } = useToast();
  const { language } = useLanguage();

  const translations = {
    fr: {
      uploadSuccess: "Photos téléversées avec succès !",
      uploadError: "Échec du téléversement, veuillez réessayer.",
      uploading: "Téléversement en cours..."
    },
    es: {
      uploadSuccess: "¡Fotos subidas con éxito!",
      uploadError: "Error al subir, por favor intente de nuevo.",
      uploading: "Subiendo..."
    }
  };

  const t = translations[language as keyof typeof translations];

  const handleUploadComplete = async (urls: string[]) => {
    try {
      if (sponsorId) {
        const { error: updateError } = await supabase
          .from('sponsors')
          .update({ photo_url: urls[0] })
          .eq('id', sponsorId);

        if (updateError) throw updateError;
      } else if (donationId) {
        const photoEntries = urls.map(url => ({
          donation_id: donationId,
          url: url,
        }));

        const { error: dbError } = await supabase
          .from('donation_photos')
          .insert(photoEntries);

        if (dbError) throw dbError;
      }

      setUploadStatus('success');
      onUploadComplete?.();
    } catch (error: any) {
      setUploadStatus('error');
      toast({
        variant: "destructive",
        title: "Erreur",
        description: t.uploadError,
      });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    setProgress(0);
    setUploadStatus(null);

    try {
      const files = Array.from(e.target.files);
      const totalFiles = files.length;
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const filePath = `${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
        setProgress(((i + 1) / totalFiles) * 100);
      }

      await handleUploadComplete(uploadedUrls);
    } catch (error) {
      setUploadStatus('error');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="w-full cursor-pointer"
        disabled={uploading}
      />

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-500">{t.uploading}</p>
        </div>
      )}

      {uploadStatus === 'success' && (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600 ml-2">
            {t.uploadSuccess}
          </AlertDescription>
        </Alert>
      )}

      {uploadStatus === 'error' && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">
            {t.uploadError}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};