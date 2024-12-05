import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { HomepageSection } from "@/types/homepage";

export const HeroSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const { data: heroContent, isLoading } = useQuery({
    queryKey: ['hero-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('section_key', 'hero')
        .single();
      
      if (error) {
        console.error('Error fetching hero content:', error);
        throw error;
      }

      const content = data.content as Record<string, any>;
      
      const typedData: HomepageSection = {
        ...data,
        content: {
          ctaText: content.ctaText || '',
          leftImage: content.leftImage || '',
          rightImage: content.rightImage || '',
          mobileImage: content.mobileImage || ''
        }
      };
      
      return typedData;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const mainImage = "/lovable-uploads/7b0fcfb7-f95f-4624-990d-4a7f8ca8d21c.png";

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between p-4 md:p-8 bg-cuba-gradient text-white">
      <img
        src={mainImage}
        alt="Happy child with toys"
        className="w-full md:w-1/3 h-auto md:h-[500px] object-cover object-top rounded-lg mb-4 md:mb-0"
      />
      <div className="md:w-1/3 text-center space-y-4">
        <h1 className="text-4xl font-bold">{heroContent?.title || t('sponsorshipTitle')}</h1>
        <p className="text-lg">{heroContent?.subtitle || t('sponsorshipDescription')}</p>
        <Button 
          onClick={() => navigate('/children')}
          className="bg-secondary hover:bg-secondary-hover text-white"
        >
          {heroContent?.content?.ctaText || t('becomeSponsor')}
        </Button>
      </div>
      <img
        src={heroContent?.content?.rightImage || '/placeholder.svg'}
        alt="Right"
        className="w-full md:w-1/4 h-48 md:h-96 object-cover rounded-lg mt-4 md:mt-0"
      />
    </div>
  );
};