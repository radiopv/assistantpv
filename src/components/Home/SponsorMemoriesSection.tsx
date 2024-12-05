import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const SponsorMemoriesSection = () => {
  const { t } = useLanguage();

  const { data: sponsorPhotos, isLoading } = useQuery({
    queryKey: ['featured-sponsor-photos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('album_media')
        .select('*')
        .eq('is_featured', true)
        .eq('type', 'image')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching featured sponsor photos:', error);
        throw error;
      }
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <section className="py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">{t('sponsorAlbum')}</h2>
      <Carousel className="max-w-5xl mx-auto">
        <CarouselContent>
          {sponsorPhotos?.map((photo) => (
            <CarouselItem key={photo.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <img
                  src={photo.url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};