import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FeaturedChildren } from "@/components/Home/FeaturedChildren";
import { HowItWorks } from "@/components/Home/HowItWorks";
import { CallToAction } from "@/components/Home/CallToAction";
import { FeaturedTestimonials } from "@/components/Home/FeaturedTestimonials";
import { FeaturedAlbum } from "@/components/Home/FeaturedAlbum";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageCropDialog } from "@/components/ImageCrop/ImageCropDialog";
import { toast } from "sonner";

interface HomepageSection {
  section_key: string;
  content: {
    imageUrl?: string;
    [key: string]: any;
  };
  title?: string;
  subtitle?: string;
}

const Home = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isImageCropOpen, setIsImageCropOpen] = useState(false);

  // Fetch homepage sections
  const { data: sections, isLoading } = useQuery({
    queryKey: ['homepage-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_sections')
        .select('*');
      if (error) throw error;
      return data as HomepageSection[];
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

      // Update the hero section with the new image URL
      const { error: updateError } = await supabase
        .from('homepage_sections')
        .update({
          content: {
            ...(heroSection?.content || {}),
            imageUrl: `${process.env.SUPABASE_URL}/storage/v1/object/public/homepage-media/hero-image.jpg`
          }
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
      {/* Hero Section with Split Layout */}
      <section className="relative h-[90vh] bg-cuba-gradient">
        <div className="container mx-auto h-full">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Left Side - Hero Image */}
            <div className="w-full lg:w-1/2 h-[50vh] lg:h-full relative">
              <img 
                src="/lovable-uploads/c0c5a7da-df66-4f94-91c4-b5428f6fcc0d.png"
                alt="Hero background"
                className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                onClick={() => setIsImageCropOpen(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/20" />
            </div>

            {/* Right Side - Content */}
            <div className="w-full lg:w-1/2 p-6 lg:p-12 bg-white/90 backdrop-blur-sm">
              <div className="max-w-xl mx-auto space-y-8">
                {/* Hero Content */}
                <div className="text-center lg:text-left animate-fade-in">
                  <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
                    {heroSection?.title || t('heroTitle')}
                  </h1>
                  <p className="text-xl text-gray-600 mb-8">
                    {heroSection?.subtitle || t('heroSubtitle')}
                  </p>
                  <Button 
                    onClick={() => navigate("/become-sponsor")}
                    size="lg"
                    className="bg-primary hover:bg-primary-hover text-white transform transition-all duration-300 hover:scale-105"
                  >
                    {t('becomeSponsor')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Children Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <FeaturedChildren />
        </div>
      </section>

      {/* Testimonials and Album Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Featured Testimonials */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">{t('testimonials')}</h2>
              <FeaturedTestimonials />
            </div>

            {/* Featured Album */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">{t('featuredPhotos')}</h2>
              <FeaturedAlbum />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <HowItWorks />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <CallToAction />
        </div>
      </section>

      {/* Image Crop Dialog */}
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