import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FeaturedChildren } from "@/components/Home/FeaturedChildren";
import { HowItWorks } from "@/components/Home/HowItWorks";
import { CallToAction } from "@/components/Home/CallToAction";
import { FeaturedAlbum } from "@/components/Home/FeaturedAlbum";
import { HeroSection } from "@/components/Home/HeroSection";
import { ImageCropDialog } from "@/components/ImageCrop/ImageCropDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const Home = () => {
  const [isImageCropOpen, setIsImageCropOpen] = useState(false);

  const { data: sections, isLoading } = useQuery({
    queryKey: ['homepage-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_sections')
        .select('*')
        .order('order_index');
      if (error) throw error;
      return data;
    }
  });

  const heroSection = sections?.find(section => section.section_key === 'hero');

  const handleImageCrop = async (croppedImageBlob: Blob) => {
    try {
      const file = new File([croppedImageBlob], 'hero-image.jpg', { type: 'image/jpeg' });
      
      const { data, error } = await supabase.storage
        .from('homepage-media')
        .upload('hero-image.jpg', file, {
          upsert: true,
        });

      if (error) throw error;

      const { error: updateError } = await supabase
        .from('homepage_sections')
        .update({
          content: heroSection?.content ? 
            { ...heroSection.content as Record<string, unknown>, imageUrl: `${process.env.SUPABASE_URL}/storage/v1/object/public/homepage-media/hero-image.jpg` } 
            : { imageUrl: `${process.env.SUPABASE_URL}/storage/v1/object/public/homepage-media/hero-image.jpg` }
        })
        .eq('section_key', 'hero');

      if (updateError) throw updateError;

      toast.success("Image mise à jour avec succès");
      setIsImageCropOpen(false);
    } catch (error) {
      console.error('Error updating hero image:', error);
      toast.error("Erreur lors de la mise à jour de l'image");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <section className="relative h-[90vh] bg-cuba-gradient">
          <div className="container mx-auto h-full">
            <div className="flex flex-col lg:flex-row h-full">
              <div className="w-full lg:w-1/2 h-[50vh] lg:h-full relative">
                <Skeleton className="absolute inset-0" />
              </div>
              <div className="w-full lg:w-1/2 p-6 lg:p-12 bg-white/90 backdrop-blur-sm">
                <div className="max-w-xl mx-auto space-y-8">
                  <div className="text-center lg:text-left animate-fade-in">
                    <Skeleton className="h-12 w-3/4 mb-4" />
                    <Skeleton className="h-6 w-full mb-8" />
                    <Skeleton className="h-10 w-40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroSection 
        heroSection={heroSection} 
        onImageClick={() => setIsImageCropOpen(true)} 
      />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <HowItWorks />
        </div>
      </section>

      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <CallToAction />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <FeaturedChildren />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Photos</h2>
              <FeaturedAlbum />
            </div>
          </div>
        </div>
      </section>

      <ImageCropDialog
        open={isImageCropOpen}
        onClose={() => setIsImageCropOpen(false)}
        imageSrc="/lovable-uploads/c0c5a7da-df66-4f94-91c4-b5428f6fcc0d.png"
        onCropComplete={handleImageCrop}
      />
    </div>
  );
};

export default Home;