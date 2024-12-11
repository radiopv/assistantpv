import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MultiFileUpload } from "@/components/shared/MultiFileUpload/MultiFileUpload";

interface AlbumMediaUploadProps {
  childId: string;
  onUploadComplete?: () => void;
}

export const AlbumMediaUpload = ({ childId, onUploadComplete }: AlbumMediaUploadProps) => {
  const { toast } = useToast();

  const handleUploadComplete = async (urls: string[]) => {
    try {
      const mediaEntries = urls.map(url => ({
        child_id: childId,
        url: url,
        type: 'image'
      }));

      const { error: dbError } = await supabase
        .from('album_media')
        .insert(mediaEntries);

      if (dbError) throw dbError;

      toast({
        title: "Photos ajoutées",
        description: "Les photos ont été ajoutées avec succès à l'album.",
      });

      onUploadComplete?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout des photos.",
      });
    }
  };

  return (
    <MultiFileUpload
      bucketName="album-media"
      path={childId}
      onUploadComplete={handleUploadComplete}
    />
  );
};