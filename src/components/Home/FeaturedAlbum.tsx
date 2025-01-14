import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { UnifiedMedia } from "@/types/media";

export const FeaturedAlbum = () => {
  const navigate = useNavigate();
  const { data: media = [], isLoading } = useQuery({
    queryKey: ['featured-media'],
    queryFn: async () => {
      try {
        const { data: albumMedia, error: albumError } = await supabase
          .from('album_media')
          .select(`
            id,
            url,
            type,
            title,
            description,
            created_at,
            children (name),
            sponsors!album_media_new_sponsor_id_fkey (name, is_anonymous)
          `)
          .eq('is_featured', true)
          .eq('is_approved', true)
          .limit(10)
          .order('created_at', { ascending: false });

        if (albumError) throw albumError;

        return albumMedia || [];
      } catch (error) {
        console.error("Erreur lors de la récupération des médias:", error);
        return [];
      }
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  if (!media?.length) {
    return <p className="text-gray-500 text-center">Aucun souvenir partagé pour le moment</p>;
  }

  return (
    <div className="space-y-6">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-5xl mx-auto"
      >
        <CarouselContent>
          {media.map((item) => (
            <CarouselItem key={item.id} className="md:basis-1/3 lg:basis-1/5">
              <Card className="relative group overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  {item.type === 'video' ? (
                    <div className="relative aspect-square">
                      <video
                        src={item.url}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        onClick={() => window.open(item.url, '_blank')}
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.title || "Souvenir"}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                      onClick={() => window.open(item.url, '_blank')}
                    />
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-black/50 p-2 text-white text-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="font-medium truncate">{item.title || "Sans titre"}</p>
                  <p className="text-xs opacity-75">
                    {format(new Date(item.created_at), "d MMMM yyyy", { locale: fr })}
                  </p>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>

      <div className="text-center">
        <Button 
          variant="outline"
          className="group"
          onClick={() => navigate("/album")}
        >
          Voir tous les souvenirs
          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};