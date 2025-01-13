import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ImagePlus, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";

interface AlbumMediaGridProps {
  childId: string;
}

export const AlbumMediaGrid = ({ childId }: AlbumMediaGridProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();

  const { data: media, isLoading } = useQuery({
    queryKey: ['album-media', childId],
    queryFn: async () => {
      try {
        const { data: childData, error: childError } = await supabase
          .from('children')
          .select('name')
          .eq('id', childId)
          .maybeSingle();

        if (childError) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer les informations de l'enfant"
          });
          throw childError;
        }

        const { data: mediaData, error: mediaError } = await supabase
          .from('album_media')
          .select(`
            id,
            url,
            type,
            title,
            description,
            is_featured,
            created_at,
            sponsor_id,
            sponsors (
              name,
              role
            )
          `)
          .eq('child_id', childId)
          .eq('is_approved', true)
          .order('created_at', { ascending: false });

        if (mediaError) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer les photos de l'album"
          });
          throw mediaError;
        }

        console.log('Photos récupérées:', mediaData);

        return {
          media: mediaData || [],
          childName: childData?.name
        };
      } catch (error) {
        console.error('Erreur lors de la récupération des photos:', error);
        return {
          media: [],
          childName: null
        };
      }
    },
    enabled: !!childId
  });

  const translations = {
    fr: {
      noPhotos: "Aucune photo dans l'album",
      addPhotos: "Ajouter des photos",
      albumOf: "Album de"
    },
    es: {
      noPhotos: "No hay fotos en el álbum",
      addPhotos: "Agregar fotos",
      albumOf: "Álbum de"
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

  if (!media?.media?.length) {
    return (
      <Card className="p-8 flex flex-col items-center justify-center space-y-4">
        <ImagePlus className="w-12 h-12 text-gray-400" />
        <p className="text-gray-500 text-center">{t.noPhotos}</p>
        <Button variant="outline">{t.addPhotos}</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">
        {t.albumOf} {media.childName}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.media.map((item) => (
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
                  alt={`Photo de ${media.childName}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                  onClick={() => window.open(item.url, '_blank')}
                />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};