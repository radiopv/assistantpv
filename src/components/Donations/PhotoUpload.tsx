import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";

interface PhotoUploadProps {
  donationId?: string;
  sponsorId?: string;
  bucketName?: string;
  onUploadComplete?: () => void;
  onPhotosChange?: (files: FileList | null) => void;
}

const MAX_FILES = 20;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const PhotoUpload = ({ 
  donationId, 
  sponsorId,
  bucketName = 'donation-photos',
  onUploadComplete, 
  onPhotosChange 
}: PhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previews, setPreviews] = useState<{ file: File; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { language } = useLanguage();

  const translations = {
    fr: {
      addPhotos: "Ajouter des photos",
      dragPhotos: "Glissez vos photos ici ou cliquez pour sélectionner",
      maxFilesReached: "Nombre maximum de fichiers atteint (20)",
      invalidFileType: "Format de fichier non supporté. Utilisez JPG, PNG ou WEBP",
      fileTooLarge: "Fichier trop volumineux (max 5MB)",
      uploadError: "Erreur lors de l'upload",
      uploadSuccess: "Photos ajoutées avec succès",
      uploading: "Upload en cours..."
    },
    es: {
      addPhotos: "Agregar fotos",
      dragPhotos: "Arrastra tus fotos aquí o haz clic para seleccionar",
      maxFilesReached: "Número máximo de archivos alcanzado (20)",
      invalidFileType: "Formato de archivo no soportado. Usa JPG, PNG o WEBP",
      fileTooLarge: "Archivo demasiado grande (máx 5MB)",
      uploadError: "Error durante la subida",
      uploadSuccess: "Fotos agregadas con éxito",
      uploading: "Subiendo..."
    }
  };

  const t = translations[language as keyof typeof translations];

  const validateFile = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({ title: "Erreur", description: t.invalidFileType });
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "Erreur", description: t.fileTooLarge });
      return false;
    }
    return true;
  };

  const handleFiles = (files: FileList) => {
    if (previews.length + files.length > MAX_FILES) {
      toast({ title: "Erreur", description: t.maxFilesReached });
      return;
    }

    const validFiles = Array.from(files).filter(validateFile);
    const newPreviews = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPreviews(prev => [...prev, ...newPreviews]);
    if (onPhotosChange) onPhotosChange(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('border-primary');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-primary');
    }
  };

  const removePreview = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (!previews.length) return;

    setUploading(true);
    setProgress(0);

    try {
      const totalFiles = previews.length;
      let completed = 0;

      for (const { file } of previews) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${sponsorId || donationId}/${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        if (donationId) {
          const { error: dbError } = await supabase
            .from('donation_photos')
            .insert({
              donation_id: donationId,
              url: publicUrl,
            });

          if (dbError) throw dbError;
        }

        completed++;
        setProgress((completed / totalFiles) * 100);
      }

      toast({
        title: "Succès",
        description: t.uploadSuccess,
      });

      setPreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onUploadComplete?.();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: t.uploadError,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        ref={dropZoneRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer hover:border-primary"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">{t.dragPhotos}</p>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {uploading && (
        <Progress value={progress} className="w-full animate-pulse" />
      )}

      {previews.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group animate-fade-in">
                <img
                  src={preview.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <button
                  onClick={() => removePreview(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? t.uploading : t.addPhotos}
          </Button>
        </>
      )}
    </div>
  );
};