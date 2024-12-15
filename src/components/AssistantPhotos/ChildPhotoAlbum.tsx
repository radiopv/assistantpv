import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChildPhotoAlbumProps {
  childId: string;
}

export const ChildPhotoAlbum = ({ childId }: ChildPhotoAlbumProps) => {
  const queryClient = useQueryClient();
  const { language } = useLanguage();

  const translations = {
    fr: {
      noPhotos: "Aucune photo n'a encore été ajoutée",
      deleteSuccess: "Photo supprimée avec succès",
      deleteError: "Erreur lors de la suppression",
      favoriteAdded: "Photo ajoutée aux favoris",
      favoriteRemoved: "Photo retirée des favoris",
    },
    es: {
      noPhotos: "Aún no se han agregado fotos",
      deleteSuccess: "Foto eliminada con éxito",
      deleteError: "Error al eliminar",
      favoriteAdded: "Foto añadida a favoritos",
      favoriteRemoved: "Foto eliminada de favoritos",
    }
  };

  const t = translations[language as keyof typeof translations];

  const { data: photos, isLoading } = useQuery({
    queryKey: ['album-photos', childId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('album_media')
        .select('*')
        .eq('child_id', childId)
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

      await supabase
        .from('album_media')
        .delete()
        .eq('id', id);

      queryClient.invalidateQueries({ queryKey: ['album-photos', childId] });
      toast.success(t.deleteSuccess);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(t.deleteError);
    }
  };

  const toggleFavorite = async (id: string, currentStatus: boolean) => {
    try {
      await supabase
        .from('album_media')
        .update({ is_featured: !currentStatus })
        .eq('id', id);

      queryClient.invalidateQueries({ queryKey: ['album-photos', childId] });
      toast.success(currentStatus ? t.favoriteRemoved : t.favoriteAdded);
    } catch (error) {
      console.error('Favorite toggle error:', error);
    }
  };

  if (isLoading) {
    return <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="aspect-square bg-gray-200 rounded-lg" />
      ))}
    </div>;
  }

  if (!photos?.length) {
    return <p className="text-gray-500">{t.noPhotos}</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <Card key={photo.id} className="relative group overflow-hidden">
          <img
            src={photo.url}
            alt="Album photo"
            className="w-full aspect-square object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-yellow-400"
              onClick={() => toggleFavorite(photo.id, !!photo.is_featured)}
            >
              <Star className={`w-5 h-5 ${photo.is_featured ? 'fill-yellow-400' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-blue-400"
            >
              <Pencil className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-red-400"
              onClick={() => handleDelete(photo.id, photo.url)}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};