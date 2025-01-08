import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ImagePlus, X, Upload, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface PhotoUploadDialogProps {
  donationId: string;
  onUploadComplete: () => void;
}

export const PhotoUploadDialog = ({ donationId, onUploadComplete }: PhotoUploadDialogProps) => {
  const [selectedFiles, setSelectedFiles] = useState<{ file: File; preview: string; status: 'pending' | 'uploading' | 'success' | 'error' }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { language } = useLanguage();

  const translations = {
    fr: {
      addPhotos: "Ajouter des photos",
      addMorePhotos: "Ajouter d'autres photos",
      submit: "Soumettre",
      uploading: "Envoi en cours... Veuillez patienter.",
      success: "Merci ! Toutes les photos ont été envoyées.",
      error: "Une erreur est survenue. Réessayez d'envoyer les photos non transmises.",
      invalidFormat: "Seuls les fichiers JPG, PNG ou WebP sont autorisés.",
      uploadingProgress: "Envoi des photos en cours..."
    },
    es: {
      addPhotos: "Agregar fotos",
      addMorePhotos: "Agregar más fotos",
      submit: "Enviar",
      uploading: "Subiendo... Por favor espere.",
      success: "¡Gracias! Todas las fotos han sido enviadas.",
      error: "Ha ocurrido un error. Intente reenviar las fotos no transmitidas.",
      invalidFormat: "Solo se permiten archivos JPG, PNG o WebP.",
      uploadingProgress: "Subiendo fotos..."
    }
  };

  const t = translations[language as keyof typeof translations];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const files = Array.from(event.target.files).filter(file => {
      if (!allowedTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: t.invalidFormat,
          description: t.invalidFormat
        });
        return false;
      }
      return true;
    });

    const newFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'pending' as const
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const uploadFiles = async () => {
    if (!selectedFiles.length) return;

    setUploading(true);
    setProgress(0);

    try {
      const totalFiles = selectedFiles.length;
      let completedFiles = 0;

      for (let i = 0; i < selectedFiles.length; i++) {
        const { file } = selectedFiles[i];
        setSelectedFiles(prev => {
          const newFiles = [...prev];
          newFiles[i].status = 'uploading';
          return newFiles;
        });

        const fileExt = file.name.split('.').pop();
        const filePath = `${donationId}/${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('donation-photos')
          .upload(filePath, file);

        if (uploadError) {
          setSelectedFiles(prev => {
            const newFiles = [...prev];
            newFiles[i].status = 'error';
            return newFiles;
          });
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('donation-photos')
          .getPublicUrl(filePath);

        const { error: dbError } = await supabase
          .from('donation_photos')
          .insert({
            donation_id: donationId,
            url: publicUrl,
            title: file.name
          });

        if (dbError) {
          setSelectedFiles(prev => {
            const newFiles = [...prev];
            newFiles[i].status = 'error';
            return newFiles;
          });
          continue;
        }

        setSelectedFiles(prev => {
          const newFiles = [...prev];
          newFiles[i].status = 'success';
          return newFiles;
        });

        completedFiles++;
        setProgress((completedFiles / totalFiles) * 100);
      }

      if (completedFiles === totalFiles) {
        toast({
          title: t.success,
          description: t.success,
        });
        onUploadComplete();
        setSelectedFiles([]);
      } else {
        toast({
          variant: "destructive",
          title: t.error,
          description: t.error,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t.error,
        description: t.error,
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-4" role="region" aria-live="polite">
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="photo-upload"
          aria-label={t.addPhotos}
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          size="lg"
          className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600"
        >
          <ImagePlus className="w-5 h-5" />
          <span>{selectedFiles.length ? t.addMorePhotos : t.addPhotos}</span>
        </Button>
      </div>

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full h-2" />
          <p className="text-sm text-gray-500 text-center">
            {t.uploadingProgress} ({Math.floor(progress)}%)
          </p>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group animate-fade-in">
                <img
                  src={file.preview}
                  alt={file.file.name}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  {file.status === 'success' && (
                    <Check className="w-8 h-8 text-green-500" />
                  )}
                  {file.status === 'error' && (
                    <X className="w-8 h-8 text-red-500" />
                  )}
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={uploading}
                  aria-label="Supprimer la photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <Button 
            onClick={uploadFiles} 
            disabled={uploading} 
            className="w-full"
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <Upload className="w-4 h-4 animate-spin" />
                {t.uploading}
              </span>
            ) : (
              t.submit
            )}
          </Button>
        </>
      )}
    </div>
  );
};