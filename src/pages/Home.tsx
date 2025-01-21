import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HeroSection } from "@/components/Home/HeroSection";
import { ImpactStats } from "@/components/Home/ImpactStats";
import { HowItWorks } from "@/components/Home/HowItWorks";
import { FeaturedChildren } from "@/components/Home/FeaturedChildren";
import { FeaturedAlbum } from "@/components/Home/FeaturedAlbum";
import { FeaturedTestimonials } from "@/components/Home/FeaturedTestimonials";
import { CallToAction } from "@/components/Home/CallToAction";
import { JourneySection } from "@/components/Home/JourneySection";
import { toast } from "sonner";

interface HomepageModule {
  id: string;
  module_type: string;
  content: {
    title?: string;
    subtitle?: string;
  };
  settings: {
    title: string;
    showTotalSponsors?: boolean;
    showTotalChildren?: boolean;
    showTotalDonations?: boolean;
    animateNumbers?: boolean;
    backgroundStyle?: string;
    steps?: {
      title: string;
      description: string;
    }[];
    showProgressBar?: boolean;
  };
  is_active: boolean;
  order_index: number;
}

export default function Home() {
  const { data: modules, isLoading, error } = useQuery({
    queryKey: ['homepage-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_modules')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (error) {
        console.error('Error fetching modules:', error);
        toast.error("Erreur lors du chargement de la page");
        throw error;
      }

      return data as HomepageModule[];
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">
          Une erreur est survenue lors du chargement de la page
        </div>
      </div>
    );
  }

  const renderModule = (module: HomepageModule) => {
    const moduleWrapper = (content: JSX.Element) => (
      <div key={module.id} className="w-full py-4 sm:py-8 bg-cuba-offwhite">
        <div className="container mx-auto px-4">
          {content}
        </div>
      </div>
    );

    switch (module.module_type) {
      case 'hero':
        return (
          <HeroSection 
            key={module.id} 
            heroSection={module.content}
            onImageClick={() => console.log("Image clicked")}
          />
        );
      case 'impact_stats':
      case 'impact-stats':
        return moduleWrapper(
          <ImpactStats 
            settings={{
              title: module.settings.title,
              showTotalSponsors: module.settings.showTotalSponsors || false,
              showTotalChildren: module.settings.showTotalChildren || false,
              showTotalDonations: module.settings.showTotalDonations || false,
              animateNumbers: module.settings.animateNumbers || false,
              backgroundStyle: module.settings.backgroundStyle || "gradient"
            }}
          />
        );
      case 'how_it_works':
      case 'how-it-works':
        return moduleWrapper(
          <HowItWorks />
        );
      case 'featured_children':
      case 'featured-children':
      case 'children-grid':
        return moduleWrapper(
          <FeaturedChildren />
        );
      case 'featured_album':
      case 'featured-album':
        return moduleWrapper(
          <FeaturedAlbum />
        );
      case 'testimonials':
        return moduleWrapper(
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-cuba-coral font-title">
              {module.settings?.title || "Témoignages de nos parrains"}
            </h2>
            <FeaturedTestimonials />
          </div>
        );
      case 'journey':
        if (!module.settings.steps) return null;
        return moduleWrapper(
          <JourneySection 
            settings={{
              title: module.settings.title,
              steps: module.settings.steps,
              showProgressBar: module.settings.showProgressBar
            }} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-offwhite to-white space-y-2 sm:space-y-4">
      {modules?.map(renderModule)}
      <CallToAction />
    </div>
  );
}