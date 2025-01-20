import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoplayPlugin from "embla-carousel-autoplay";
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedMedia {
  id: string | number;
  url: string;
  title: string | null;
  children?: {
    name: string;
  } | null;
  sponsor_id?: string | null;
  created_at: string;
  source_table?: string;
}

export const FeaturedAlbum = () => {
  const { data: featuredMedia, isLoading } = useQuery({
    queryKey: ["featured-media"],
    queryFn: async () => {
      try {
        console.log('Fetching featured media from multiple sources...');
        
        // Fetch from album_media
        const { data: albumMedia, error: albumError } = await supabase
          .from("album_media")
          .select(`
            id,
            url,
            title,
            children (name),
            sponsor_id,
            created_at
          `)
          .eq("is_approved", true)
          .eq("type", "image")
          .eq("is_featured", true)
          .order("created_at", { ascending: false });

        if (albumError) throw albumError;

        // Fetch from donation_photos
        const { data: donationPhotos, error: donationError } = await supabase
          .from("donation_photos")
          .select(`
            id,
            url,
            title,
            created_at
          `)
          .eq("is_featured", true)
          .order("created_at", { ascending: false });

        if (donationError) throw donationError;

        // Fetch from community_highlights
        const { data: highlights, error: highlightsError } = await supabase
          .from("community_highlights")
          .select(`
            id,
            image_url,
            title,
            created_at
          `)
          .eq("is_featured", true)
          .order("created_at", { ascending: false });

        if (highlightsError) throw highlightsError;

        // Combine and format all media
        const allMedia: FeaturedMedia[] = [
          ...(albumMedia?.map(item => ({
            ...item,
            source_table: 'album_media'
          })) || []),
          ...(donationPhotos?.map(item => ({
            id: item.id,
            url: item.url,
            title: item.title,
            created_at: item.created_at,
            sponsor_id: null,
            source_table: 'donation_photos'
          })) || []),
          ...(highlights?.map(item => ({
            id: item.id,
            url: item.image_url,
            title: item.title,
            created_at: item.created_at,
            sponsor_id: null,
            source_table: 'community_highlights'
          })) || [])
        ].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        console.log('Combined featured media:', allMedia);
        return allMedia;
      } catch (error) {
        console.error("Error fetching featured media:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000 // Keep in garbage collection for 10 minutes
  });

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-4">
        <h2 className="text-2xl font-semibold text-center mb-6">Moments partagés</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!featuredMedia?.length) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold text-center mb-6">Moments partagés</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          AutoplayPlugin({
            delay: 3000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {featuredMedia.map((media) => (
            <CarouselItem key={media.id} className="md:basis-1/3 lg:basis-1/4">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <img
                  src={media.url}
                  alt={media.title || "Photo souvenir"}
                  className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                />
                {media.children?.name && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white">
                    <p className="text-xs truncate">{media.children.name}</p>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};