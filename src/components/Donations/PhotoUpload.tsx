import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProgressIndicator } from "./PhotoUpload/ProgressIndicator";
import { UploadStatus } from "./PhotoUpload/UploadStatus";
import { PhotoPreview } from "./PhotoUpload/PhotoPreview";

interface PhotoUploadProps {
  onPhotosChange?: (files: FileList | null) => void;
}

export const PhotoUpload = ({ onPhotosChange }: PhotoUploadProps) => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'success' | 'error' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { language } = useLanguage();

  const t = language === 'fr' ? {
    selectPhotos: "Sélectionner des photos",
    upload: "Téléverser",
  } : {
    selectPhotos: "Seleccionar fotos",
    upload: "Subir",
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const newPhotos = Array.from(e.target.files);
    setPhotos(prev => [...prev, ...newPhotos]);
    if (onPhotosChange) {
      onPhotosChange(e.target.files);
    }
    setUploadStatus(null);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setUploadStatus(null);
  };

  const handleUpload = async () => {
    if (!photos.length) return;

    setUploading(true);
    setProgress(0);
    setUploadStatus(null);

    try {
      const totalPhotos = photos.length;
      let completed = 0;

      for (const photo of photos) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('donation-photos')
          .upload(fileName, photo);

        if (uploadError) throw uploadError;

        completed++;
        setProgress((completed / totalPhotos) * 100);
      }

      setUploadStatus('success');
      setPhotos([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          disabled={uploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {t.selectPhotos}
        </Button>
        {photos.length > 0 && (
          <Button onClick={handleUpload} disabled={uploading}>
            {t.upload} ({photos.length})
          </Button>
        )}
      </div>

      {uploading && <ProgressIndicator progress={progress} />}
      
      <UploadStatus status={uploadStatus} />

      {photos.length > 0 && (
        <PhotoPreview photos={photos} onRemove={removePhoto} />
      )}
    </div>
  );
};