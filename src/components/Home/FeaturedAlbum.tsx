import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export const FeaturedAlbum = () => {
  const [photos, setPhotos] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeaturedPhotos = async () => {
      const { data, error } = await supabase
        .from('album_media')
        .select(`
          *,
          children (name),
          sponsors (name)
        `)
        .eq('is_featured', true)
        .eq('is_approved', true)
        .limit(10);

      if (error) {
        console.error('Error fetching featured photos:', error);
        return;
      }

      setPhotos(data || []);
    };

    fetchFeaturedPhotos();
  }, []);

  if (photos.length === 0) {
    return null;
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
      className="w-full max-w-4xl mx-auto"
    >
      <CarouselContent>
        {photos.map((photo) => (
          <CarouselItem key={photo.id} className="md:basis-1/3 lg:basis-1/4">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <img
                src={photo.url}
                alt={photo.title || "Photo souvenir"}
                className="object-cover w-full h-full"
              />
              {photo.title && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white">
                  <p className="text-xs truncate">{photo.title}</p>
                </div>
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};