import { useState, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PhotoUploaderProps {
  childId: string;
  onUploadSuccess: () => void;
}

export const PhotoUploader = ({ childId, onUploadSuccess }: PhotoUploaderProps) => {
  const [previews, setPreviews] = useState<{ file: File; preview: string }[]>([]);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        const filePath = `${childId}/${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('album-media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('album-media')
          .getPublicUrl(filePath);

        await supabase.from('album_media').insert({
          child_id: childId,
          url: publicUrl,
          type: 'image'
        });

        completed++;
        setProgress((completed / totalFiles) * 100);
      }

      setPreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onUploadSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Une erreur est survenue pendant l'upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
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
          Sélectionner des photos
        </Button>
        {previews.length > 0 && (
          <Button onClick={uploadFiles} disabled={uploading}>
            Upload ({previews.length} photos)
          </Button>
        )}
      </div>

      {uploading && (
        <Progress value={progress} className="w-full" />
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview.preview}
                alt="Preview"
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
      )}
    </div>
  );
};