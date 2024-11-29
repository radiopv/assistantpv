import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { HomeImage } from "@/types/homepage";

export const HomeImages = () => {
  const isMobile = useIsMobile();
  
  const { data: images, isLoading } = useQuery<HomeImage[]>({
    queryKey: ['home-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('home_images')
        .select('*')
        .order('position');
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return null;

  const getImagesByPosition = (position: HomeImage['position']) => 
    images?.filter(img => img.position === position) || [];

  const getLayoutImages = () => {
    if (isMobile) {
      return images?.filter(img => img.layout_position === 'mobile') || [];
    }
    return images?.filter(img => img.layout_position === 'left' || img.layout_position === 'right')
      .sort((a, b) => a.layout_position === 'left' ? -1 : 1) || [];
  };

  const layoutImages = getLayoutImages();

  return (
    <div className="w-full">
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4 relative h-[600px] md:h-[70vh]`}>
        {layoutImages.map((image) => (
          <div 
            key={image.id}
            className="relative h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${image.url})` }}
          >
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}
      </div>

      {/* Secondary Images */}
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        {getImagesByPosition('secondary').map((image) => (
          <div 
            key={image.id}
            className="aspect-video rounded-lg overflow-hidden"
          >
            <img 
              src={image.url} 
              alt="Featured" 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};