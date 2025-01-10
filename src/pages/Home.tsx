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
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Users, Gift, Star } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-cuba-offwhite">
      <HeroSection 
        heroSection={heroSection} 
        onImageClick={() => setIsImageCropOpen(true)} 
      />

      {/* Section À propos */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-16 bg-cuba-warmBeige"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-title font-bold text-cuba-turquoise mb-6">
                Notre Mission
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Nous créons des liens durables entre des parrains généreux et des enfants cubains, 
                apportant espoir et soutien à ceux qui en ont le plus besoin.
              </p>
              <Button 
                onClick={() => navigate("/about")}
                variant="outline" 
                className="bg-white hover:bg-cuba-softYellow transition-colors"
              >
                En savoir plus
              </Button>
            </div>
            <div className="lg:w-1/2">
              <img 
                src="/lovable-uploads/c0c5a7da-df66-4f94-91c4-b5428f6fcc0d.png" 
                alt="Mission illustration" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section Points forts */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-title font-bold text-center text-cuba-turquoise mb-12">
            Comment nous aidons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Heart className="w-12 h-12 text-cuba-red" />,
                title: "Parrainage",
                description: "Créez un lien spécial avec un enfant cubain"
              },
              {
                icon: <Gift className="w-12 h-12 text-cuba-gold" />,
                title: "Dons",
                description: "Apportez une aide concrète et immédiate"
              },
              {
                icon: <Users className="w-12 h-12 text-cuba-turquoise" />,
                title: "Communauté",
                description: "Rejoignez une communauté solidaire"
              },
              {
                icon: <Star className="w-12 h-12 text-cuba-emerald" />,
                title: "Impact",
                description: "Changez des vies durablement"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <section className="py-16 bg-cuba-softYellow">
        <div className="container mx-auto px-4">
          <HowItWorks />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <FeaturedChildren />
        </div>
      </section>

      <section className="py-16 bg-cuba-warmBeige">
        <div className="container mx-auto px-4">
          <CallToAction />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-title font-bold text-cuba-turquoise mb-4">
                Moments Partagés
              </h2>
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