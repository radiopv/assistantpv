import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoGridProps {
  childId: string;
}

export const PhotoGrid = ({ childId }: PhotoGridProps) => {
  const { data: photos, refetch } = useQuery({
    queryKey: ['album-photos', childId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('album_media')
        .select('*')
        .eq('child_id', childId)
        .eq('type', 'image')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleDelete = async (id: string, url: string) => {
    try {
      const fileName = url.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('album-media')
          .remove([fileName]);
      }

      const { error } = await supabase
        .from('album_media')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Photo supprimée avec succès");
      refetch();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Erreur lors de la suppression");
    }
  };

  if (!photos?.length) {
    return <p className="text-gray-500">Aucune photo n'a encore été ajoutée</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} className="relative group">
          <img
            src={photo.url}
            alt="Album photo"
            className="w-full aspect-square object-cover rounded-lg"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleDelete(photo.id, photo.url)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};