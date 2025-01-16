import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ImagePlus, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AlbumMediaGridProps {
  childId: string;
}

export const AlbumMediaGrid = ({ childId }: AlbumMediaGridProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: media, isLoading } = useQuery({
    queryKey: ['album-media', childId],
    queryFn: async () => {
      try {
        console.log('Fetching photos for child:', childId);
        
        const { data: sponsorships, error: sponsorshipError } = await supabase
          .from('sponsorships')
          .select('id')
          .eq('child_id', childId)
          .eq('status', 'active')
          .single();

        if (sponsorshipError) {
          console.error('Error fetching sponsorship:', sponsorshipError);
          throw sponsorshipError;
        }

        const sponsorshipId = sponsorships?.id;
        console.log('Found sponsorship:', sponsorshipId);

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
            sponsors!album_media_new_sponsor_id_fkey (
              name,
              role,
              is_anonymous
            )
          `)
          .eq('child_id', childId)
          .eq('is_approved', true)
          .order('created_at', { ascending: false });

        if (mediaError) {
          console.error('Error fetching media:', mediaError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer les photos de l'album"
          });
          throw mediaError;
        }

        console.log('Photos récupérées:', mediaData);
        return mediaData || [];
      } catch (error) {
        console.error('Erreur lors de la récupération des photos:', error);
        return [];
      }
    },
    enabled: !!childId
  });

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('album_media')
        .update({ is_featured: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: !currentStatus ? "Photo mise en avant" : "Photo retirée des favoris",
        description: !currentStatus ? 
          "La photo apparaîtra sur la page d'accueil" : 
          "La photo n'apparaîtra plus sur la page d'accueil",
      });

      // Refresh the media data
      queryClient.invalidateQueries({ queryKey: ['album-media', childId] });
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le statut de la photo"
      });
    }
  };

  const translations = {
    fr: {
      noPhotos: "Aucune photo dans l'album",
      addPhotos: "Ajouter des photos"
    },
    es: {
      noPhotos: "No hay fotos en el álbum",
      addPhotos: "Agregar fotos"
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
            <div className="aspect-square overflow-hidden relative">
              <img
                src={item.url}
                alt={item.title || "Photo"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                onClick={() => window.open(item.url, '_blank')}
              />
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity",
                  item.is_featured && "text-yellow-500"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFeatured(item.id, item.is_featured || false);
                }}
              >
                <Star className="h-4 w-4" />
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};