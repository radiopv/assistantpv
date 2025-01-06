import { useState, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface PhotoUploaderProps {
  childId: string;
  onUploadSuccess: () => void;
}

export const PhotoUploader = ({ childId, onUploadSuccess }: PhotoUploaderProps) => {
  const [previews, setPreviews] = useState<{ file: File; preview: string; type: 'image' | 'video' }[]>([]);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguage();

  const translations = {
    fr: {
      selectFiles: "Sélectionner des fichiers",
      upload: "Upload",
      uploadWithCount: "Upload ({count} fichiers)",
      error: "Une erreur est survenue pendant l'upload",
      uploadingFile: "Upload du fichier {current}/{total}",
      uploadComplete: "Upload terminé avec succès"
    },
    es: {
      selectFiles: "Seleccionar archivos",
      upload: "Subir",
      uploadWithCount: "Subir ({count} archivos)",
      error: "Ocurrió un error durante la subida",
      uploadingFile: "Subiendo archivo {current}/{total}",
      uploadComplete: "Subida completada con éxito"
    }
  };

  const t = translations[language as keyof typeof translations];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;

    const newPreviews = Array.from(event.target.files).map(file => {
      const isVideo = file.type.startsWith('video/');
      return {
        file,
        preview: URL.createObjectURL(file),
        type: isVideo ? 'video' as const : 'image' as const
      };
    });

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
        const { file, type } = previews[i];
        
        // Calculer la progression pour ce fichier
        const baseProgress = (i / totalFiles) * 100;
        
        const fileExt = file.name.split('.').pop();
        const filePath = `${childId}/${Math.random()}.${fileExt}`;

        // Créer un nouveau FileReader pour suivre le progrès de lecture
        const reader = new FileReader();
        
        // Promesse pour suivre la progression de la lecture
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
          .from('album-media')
          .upload(filePath, file, {
            onUploadProgress: (event) => {
              const fileProgress = (event.loaded / event.total!) * (100 / totalFiles);
              setProgress(Math.floor(baseProgress + fileProgress));
            }
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('album-media')
          .getPublicUrl(filePath);

        await supabase.from('album_media').insert({
          child_id: childId,
          url: publicUrl,
          type: type
        });
      }

      toast.success(t.uploadComplete);
      setPreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onUploadSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(t.error);
    } finally {
      setUploading(false);
      setProgress(0);
      setCurrentFileIndex(0);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="photo-upload"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {t.selectFiles}
        </Button>
        {previews.length > 0 && (
          <Button onClick={uploadFiles} disabled={uploading}>
            {uploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            {uploading 
              ? t.uploadingFile.replace('{current}', (currentFileIndex + 1).toString()).replace('{total}', previews.length.toString())
              : t.uploadWithCount.replace('{count}', previews.length.toString())
            }
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
            <div key={index} className="relative group">
              {preview.type === 'video' ? (
                <video
                  src={preview.preview}
                  className="w-full aspect-square object-cover rounded-lg"
                  controls
                />
              ) : (
                <img
                  src={preview.preview}
                  alt="Preview"
                  className="w-full aspect-square object-cover rounded-lg"
                />
              )}
              <button
                onClick={() => removePreview(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={uploading}
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