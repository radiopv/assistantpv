import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HeroSection } from "@/components/Home/HeroSection";
import { ImpactStats } from "@/components/Home/ImpactStats";
import { HowItWorks } from "@/components/Home/HowItWorks";
import { FeaturedChildren } from "@/components/Home/FeaturedChildren";
import { FeaturedAlbum } from "@/components/Home/FeaturedAlbum";
import { FeaturedTestimonials } from "@/components/Home/FeaturedTestimonials";
import { CallToAction } from "@/components/Home/CallToAction";
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
    showTotalSponsors: boolean;
    showTotalChildren: boolean;
    showTotalDonations: boolean;
    animateNumbers: boolean;
    backgroundStyle: string;
  };
  is_active: boolean;
  order_index: number;
}

export default function Home() {
  const { data: modules, isLoading, error } = useQuery({
    queryKey: ['homepage-modules'],
    queryFn: async () => {
      console.log('Fetching homepage modules...'); 

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
      
      console.log('Raw data from Supabase:', data);

      if (!data || data.length === 0) {
        console.log('No active modules found');
        return [];
      }

      const transformedModules = data.map(module => {
        console.log('Processing module:', module);
        return {
          id: module.id,
          module_type: module.module_type || '',
          content: module.content || {},
          settings: {
            title: "Notre Impact",
            showTotalSponsors: true,
            showTotalChildren: true,
            showTotalDonations: true,
            animateNumbers: true,
            backgroundStyle: "gradient",
            ...(typeof module.settings === 'object' ? module.settings : {})
          },
          is_active: module.is_active || false,
          order_index: module.order_index || 0
        } as HomepageModule;
      });

      console.log('Transformed modules:', transformedModules);
      return transformedModules;
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
    console.error('Error loading modules:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">
          Une erreur est survenue lors du chargement de la page
        </div>
      </div>
    );
  }

  if (!modules || modules.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">
          Aucun module actif. Veuillez configurer la page d'accueil dans l'interface d'administration.
        </div>
      </div>
    );
  }

  console.log('Modules to render:', modules);

  const renderModule = (module: HomepageModule) => {
    console.log('Rendering module:', module);
    
    if (!module.module_type) {
      console.warn('Module without type:', module);
      return null;
    }

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
        return (
          <ImpactStats 
            key={module.id}
            settings={module.settings}
          />
        );
      case 'how_it_works':
      case 'how-it-works':
        return (
          <HowItWorks 
            key={module.id}
          />
        );
      case 'featured_children':
      case 'featured-children':
      case 'children-grid':
        return (
          <FeaturedChildren 
            key={module.id}
          />
        );
      case 'featured_album':
      case 'featured-album':
        return (
          <FeaturedAlbum 
            key={module.id}
          />
        );
      case 'testimonials':
        return (
          <div key={module.id} className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">
                {module.settings?.title || "Témoignages de nos parrains"}
              </h2>
              <FeaturedTestimonials />
            </div>
          </div>
        );
      default:
        console.warn('Unknown module type:', module.module_type);
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {modules.map(renderModule)}
      <CallToAction />
    </div>
  );
}