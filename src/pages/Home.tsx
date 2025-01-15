import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HeroSection } from "@/components/Home/HeroSection";
import { ImpactStats } from "@/components/Home/ImpactStats";
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
        .order('order_index', { ascending: true });

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

      // Transform the data to match our interface
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

  return (
    <div className="min-h-screen">
      {modules.map((module) => {
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
            return (
              <ImpactStats 
                key={module.id}
                settings={module.settings}
              />
            );
          default:
            console.warn('Unknown module type:', module.module_type);
            return null;
        }
      })}
    </div>
  );
}