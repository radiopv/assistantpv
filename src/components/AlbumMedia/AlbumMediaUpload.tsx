import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { notifyActiveSponsor } from "@/utils/sponsor-notifications";

interface AlbumMediaUploadProps {
  childId: string;
  onUploadComplete?: () => void;
}

export const AlbumMediaUpload = ({ childId, onUploadComplete }: AlbumMediaUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();

  const translations = {
    fr: {
      addPhoto: "Ajouter une photo",
      uploading: "Upload en cours...",
      upload: "Upload",
      success: "Photo ajoutée avec succès",
      error: "Une erreur est survenue lors de l'upload",
    },
    es: {
      addPhoto: "Agregar una foto",
      uploading: "Subiendo...",
      upload: "Subir",
      success: "Foto agregada con éxito",
      error: "Ocurrió un error durante la subida",
    }
  };

  const t = translations[language as keyof typeof translations];

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      setUploading(true);

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${childId}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('album-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('album-media')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('album_media')
        .insert({
          child_id: childId,
          url: publicUrl,
          type: file.type.startsWith('image/') ? 'image' : 'video',
        });

      if (dbError) throw dbError;

      // Notify sponsor about new media
      await notifyActiveSponsor(
        childId,
        t.success,
        file.type.startsWith('image/') 
          ? "Une nouvelle photo a été ajoutée à l'album"
          : "Une nouvelle vidéo a été ajoutée à l'album"
      );

      toast({
        title: t.success,
        description: t.success,
      });

      onUploadComplete?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t.error,
        description: t.error,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="photo">{t.addPhoto}</Label>
      <div className="flex items-center gap-4">
        <Input
          id="photo"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
        <Button 
          onClick={() => document.getElementById('photo')?.click()}
          disabled={uploading}
          variant="outline"
          className="w-full"
        >
          <ImagePlus className="w-4 h-4 mr-2" />
          {uploading ? t.uploading : t.upload}
        </Button>
      </div>
    </div>
  );
};
