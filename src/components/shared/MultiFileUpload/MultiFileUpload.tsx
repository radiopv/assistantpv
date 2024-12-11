import { useState, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Upload, X, Crop } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ImageCropDialog } from "@/components/ImageCrop/ImageCropDialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface MultiFileUploadProps {
  bucketName: string;
  path: string;
  onUploadComplete: (urls: string[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string[];
}

export const MultiFileUpload = ({
  bucketName,
  path,
  onUploadComplete,
  maxFiles = 20,
  maxFileSize = 5,
  acceptedFileTypes = ["image/jpeg", "image/png", "image/jpg"]
}: MultiFileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguage();

  const translations = {
    fr: {
      selectFiles: "Sélectionner des fichiers",
      uploadFiles: "Télécharger les fichiers",
      cropImage: "Recadrer l'image",
      errorFileType: "Type de fichier non supporté",
      errorFileSize: "Fichier trop volumineux",
      errorTooManyFiles: "Trop de fichiers sélectionnés",
      uploadSuccess: "Fichiers téléchargés avec succès",
      uploadError: "Erreur lors du téléchargement"
    },
    es: {
      selectFiles: "Seleccionar archivos",
      uploadFiles: "Subir archivos",
      cropImage: "Recortar imagen",
      errorFileType: "Tipo de archivo no soportado",
      errorFileSize: "Archivo demasiado grande",
      errorTooManyFiles: "Demasiados archivos seleccionados",
      uploadSuccess: "Archivos subidos con éxito",
      uploadError: "Error al subir los archivos"
    }
  };

  const t = translations[language as keyof typeof translations];

  const validateFile = (file: File): boolean => {
    if (!acceptedFileTypes.includes(file.type)) {
      toast.error(t.errorFileType);
      return false;
    }
    if (file.size > maxFileSize * 1024 * 1024) {
      toast.error(t.errorFileSize);
      return false;
    }
    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;

    const newFiles = Array.from(event.target.files);
    if (files.length + newFiles.length > maxFiles) {
      toast.error(t.errorTooManyFiles);
      return;
    }

    const validFiles = newFiles.filter(validateFile);
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));

    setFiles(prev => [...prev, ...validFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
    setProgress(prev => ({
      ...prev,
      ...Object.fromEntries(validFiles.map(file => [file.name, 0]))
    }));
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
    setProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[files[index].name];
      return newProgress;
    });
  };

  const handleCrop = (index: number) => {
    setSelectedImageIndex(index);
    setShowCropDialog(true);
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    if (selectedImageIndex === null) return;

    const newFiles = [...files];
    newFiles[selectedImageIndex] = new File([croppedImageBlob], files[selectedImageIndex].name, {
      type: files[selectedImageIndex].type
    });
    setFiles(newFiles);

    const newPreviews = [...previews];
    URL.revokeObjectURL(previews[selectedImageIndex]);
    newPreviews[selectedImageIndex] = URL.createObjectURL(croppedImageBlob);
    setPreviews(newPreviews);

    setShowCropDialog(false);
    setSelectedImageIndex(null);
  };

  const uploadFiles = async () => {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const filePath = `${path}/${Math.random()}.${fileExt}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            onUploadProgress: (event) => {
              const percent = (event.loaded / (event.total || 1)) * 100;
              setProgress(prev => ({ ...prev, [file.name]: percent }));
            }
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(t.uploadError);
        return;
      }
    }

    if (uploadedUrls.length > 0) {
      toast.success(t.uploadSuccess);
      onUploadComplete(uploadedUrls);
      setFiles([]);
      setPreviews([]);
      setProgress({});
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFileTypes.join(',')}
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
        >
          <Upload className="w-4 h-4 mr-2" />
          {t.selectFiles}
        </Button>
        {files.length > 0 && (
          <Button onClick={uploadFiles}>
            {t.uploadFiles} ({files.length})
          </Button>
        )}
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={previews[index]}
                alt={`Preview ${index + 1}`}
                className="w-full aspect-square object-cover rounded-lg"
              />
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => handleCrop(index)}
                >
                  <Crop className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => removeFile(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {progress[file.name] > 0 && progress[file.name] < 100 && (
                <Progress
                  value={progress[file.name]}
                  className="absolute bottom-0 left-0 right-0 rounded-none"
                />
              )}
            </div>
          ))}
        </div>
      )}

      <ImageCropDialog
        open={showCropDialog}
        onClose={() => setShowCropDialog(false)}
        imageSrc={selectedImageIndex !== null ? previews[selectedImageIndex] : ''}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
};