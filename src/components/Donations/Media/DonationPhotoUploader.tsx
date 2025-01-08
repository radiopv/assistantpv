import { useState, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface DonationPhotoUploaderProps {
  donationId: string;
  onUploadSuccess: () => void;
}

export const DonationPhotoUploader = ({ donationId, onUploadSuccess }: DonationPhotoUploaderProps) => {
  const [previews, setPreviews] = useState<{ file: File; preview: string }[]>([]);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguage();

  const translations = {
    fr: {
      addPhotos: "Ajouter des photos",
      upload: "Envoyer",
      uploadWithCount: "Envoyer ({count} photos)",
      error: "Une erreur est survenue pendant l'envoi",
      uploadingFile: "Envoi de la photo {current}/{total}",
      uploadComplete: "Photos envoyées avec succès",
      retry: "Réessayer"
    },
    es: {
      addPhotos: "Agregar fotos",
      upload: "Enviar",
      uploadWithCount: "Enviar ({count} fotos)",
      error: "Ocurrió un error durante el envío",
      uploadingFile: "Enviando foto {current}/{total}",
      uploadComplete: "Fotos enviadas con éxito",
      retry: "Reintentar"
    }
  };

  const t = translations[language as keyof typeof translations];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;

    const newPreviews = Array.from(event.target.files).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePreview = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadFiles = async () => {
    if (!previews.length) return;

    setUploading(true);
    setProgress(0);
    setCurrentFileIndex(0);

    try {
      const totalFiles = previews.length;

      for (let i = 0; i < previews.length; i++) {
        setCurrentFileIndex(i);
        const { file } = previews[i];
        
        const baseProgress = (i / totalFiles) * 100;
        const fileExt = file.name.split('.').pop();
        const filePath = `${donationId}/${Math.random()}.${fileExt}`;

        const reader = new FileReader();
        
        await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.onprogress = (event) => {
            if (event.lengthComputable) {
              const fileProgress = (event.loaded / event.total) * (100 / totalFiles);
              setProgress(Math.floor(baseProgress + fileProgress));
            }
          };
          reader.readAsArrayBuffer(file);
        });

        const { error: uploadError } = await supabase.storage
          .from('donation-photos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('donation-photos')
          .getPublicUrl(filePath);

        await supabase.from('donation_photos').insert({
          donation_id: donationId,
          url: publicUrl,
          title: file.name
        });

        setProgress(((i + 1) / totalFiles) * 100);
      }

      toast.success(t.uploadComplete);
      setPreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onUploadSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(t.error, {
        action: {
          label: t.retry,
          onClick: () => uploadFiles()
        }
      });
    } finally {
      setUploading(false);
      setProgress(0);
      setCurrentFileIndex(0);
    }
  };

  return (
    <div className="space-y-4" role="region" aria-live="polite">
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="donation-photo-upload"
          aria-label={t.addPhotos}
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          size="lg"
          className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600"
        >
          <ImagePlus className="w-5 h-5" />
          <span>{t.addPhotos}</span>
        </Button>
        {previews.length > 0 && (
          <Button 
            onClick={uploadFiles} 
            disabled={uploading} 
            variant="secondary" 
            size="lg"
            className={cn(
              "transition-all duration-300",
              uploading && "animate-pulse"
            )}
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t.uploadingFile
                  .replace('{current}', (currentFileIndex + 1).toString())
                  .replace('{total}', previews.length.toString())
                }
              </>
            ) : (
              t.uploadWithCount.replace('{count}', previews.length.toString())
            )}
          </Button>
        )}
      </div>

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full h-2" />
          <p className="text-sm text-gray-500 text-center">
            {Math.floor(progress)}%
          </p>
        </div>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={preview.preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => removePreview(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={uploading}
                aria-label="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};