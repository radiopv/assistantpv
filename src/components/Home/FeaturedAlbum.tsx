import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { UnifiedMedia } from "@/types/media";

export const FeaturedAlbum = () => {
  const { data: media = [], isLoading } = useQuery({
    queryKey: ['featured-media'],
    queryFn: async () => {
      try {
        // Fetch featured album media
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
          .eq('is_approved', true);

        if (albumError) throw albumError;

        // Fetch featured donation photos
        const { data: donationPhotos, error: photosError } = await supabase
          .from('donation_photos')
          .select('*')
          .eq('is_featured', true);

        if (photosError) throw photosError;

        // Fetch featured donation videos
        const { data: donationVideos, error: videosError } = await supabase
          .from('donation_videos')
          .select('*')
          .eq('is_featured', true);

        if (videosError) throw videosError;

        // Unify the media format
        const unifiedMedia: UnifiedMedia[] = [
          ...(albumMedia || []).map((item: any) => ({
            id: item.id,
            url: item.url,
            type: item.type,
            title: item.title || `Photo de ${item.children?.name || 'l\'enfant'}`,
            description: item.description,
            category: 'album',
            created_at: item.created_at,
            source_table: 'album_media'
          })),
          ...(donationPhotos || []).map((item: any) => ({
            id: item.id,
            url: item.url,
            type: 'image',
            title: item.title || 'Photo de donation',
            category: 'donation',
            created_at: item.created_at,
            source_table: 'donation_photos'
          })),
          ...(donationVideos || []).map((item: any) => ({
            id: item.id,
            url: item.url,
            type: 'video',
            title: item.title || 'Vidéo de donation',
            description: item.description,
            thumbnail_url: item.thumbnail_url,
            category: 'donation',
            created_at: item.created_at,
            source_table: 'donation_videos'
          }))
        ].sort((a, b) => 
          new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        );

        return unifiedMedia;
      } catch (error) {
        console.error("Erreur lors de la récupération des médias:", error);
        return [];
      }
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  if (!media?.length) {
    return <p className="text-gray-500">Aucun moment partagé pour le moment</p>;
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {media.map((item) => (
          <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
            <Card className="relative group overflow-hidden">
              {item.type === 'video' ? (
                <div className="relative aspect-square">
                  <video
                    src={item.url}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => window.open(item.url, '_blank')}
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ) : (
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                    onClick={() => window.open(item.url, '_blank')}
                  />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </div>
              {item.title && (
                <div className="absolute inset-x-0 bottom-0 bg-black/50 p-2 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.title}
                </div>
              )}
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};