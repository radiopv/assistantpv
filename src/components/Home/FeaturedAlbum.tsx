import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoplayPlugin from "embla-carousel-autoplay";
import { Skeleton } from "@/components/ui/skeleton";

interface AlbumMedia {
  id: string;
  url: string;
  title: string | null;
  children?: {
    name: string;
  } | null;
  sponsor_id: string | null;
  created_at: string;
}

export const FeaturedAlbum = () => {
  const { data: photos, isLoading } = useQuery({
    queryKey: ["featured-photos"],
    queryFn: async () => {
      try {
        console.log('Fetching featured photos from album_media...');
        
        const { data, error } = await supabase
          .from("album_media")
          .select(`
            *,
            children (name)
          `)
          .eq("is_approved", true)
          .eq("type", "image")
          .eq("is_featured", true)
          .order("created_at", { ascending: false })
          .limit(6);

        if (error) {
          console.error("Error fetching featured photos:", error);
          throw error;
        }

        console.log('Photos récupérées:', data);
        return data as AlbumMedia[];
      } catch (error) {
        console.error("Error in featured photos query:", error);
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

  if (!photos?.length) {
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
          {photos.map((photo) => (
            <CarouselItem key={photo.id} className="md:basis-1/3 lg:basis-1/4">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <img
                  src={photo.url}
                  alt={photo.title || "Photo souvenir"}
                  className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                />
                {photo.children?.name && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white">
                    <p className="text-xs truncate">{photo.children.name}</p>
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