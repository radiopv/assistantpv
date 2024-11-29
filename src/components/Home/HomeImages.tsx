import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface HomeImage {
  id: string;
  url: string;
  position: string;
  is_mobile: boolean;
}

export const HomeImages = () => {
  const { data: images, isLoading } = useQuery({
    queryKey: ['home-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('home_images')
        .select('*')
        .order('position');
      
      if (error) throw error;
      return data as HomeImage[];
    }
  });

  if (isLoading) return null;

  const getImagesByPosition = (position: string) => 
    images?.filter(img => img.position === position) || [];

  return (
    <div className="w-full">
      {/* Hero Image */}
      {getImagesByPosition('hero').map((image) => (
        <div key={image.id} className="relative h-[600px] bg-cover bg-center" style={{ backgroundImage: `url(${image.url})` }}>
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}

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