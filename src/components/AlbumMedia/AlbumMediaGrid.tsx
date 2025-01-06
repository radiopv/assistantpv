import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface AlbumMediaGridProps {
  childId: string;
}

export const AlbumMediaGrid = ({ childId }: AlbumMediaGridProps) => {
  const { language } = useLanguage();
  const { data: media, isLoading } = useQuery({
    queryKey: ['album-media', childId],
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

  const translations = {
    fr: {
      noPhotos: "Aucune photo dans l'album",
      addPhotos: "Ajouter des photos",
    },
    es: {
      noPhotos: "No hay fotos en el álbum",
      addPhotos: "Agregar fotos",
    }
  };

  const t = translations[language as keyof typeof translations];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  if (!media?.length) {
    return (
      <Card className="p-8 flex flex-col items-center justify-center space-y-4">
        <ImagePlus className="w-12 h-12 text-gray-400" />
        <p className="text-gray-500 text-center">{t.noPhotos}</p>
        <Button variant="outline">{t.addPhotos}</Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {media.map((item) => (
        <Card key={item.id} className="overflow-hidden relative group hover:shadow-lg transition-shadow">
          {item.type === 'video' ? (
            <div className="relative aspect-square">
              <video
                src={item.url}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => window.open(item.url, '_blank')}
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="w-12 h-12 text-white" />
              </div>
            </div>
          ) : (
            <div className="aspect-square overflow-hidden">
              <img
                src={item.url}
                alt="Album media"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onClick={() => window.open(item.url, '_blank')}
              />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};