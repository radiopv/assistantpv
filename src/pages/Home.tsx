import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HeroSection } from "@/components/Home/HeroSection";
import { ImpactStats } from "@/components/Home/ImpactStats";

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
      const { data, error } = await supabase
        .from('homepage_modules')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching modules:', error);
        throw error;
      }

      // Transform the data to match our interface
      return data.map(module => ({
        ...module,
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
        order_index: module.order_index || 0
      })) as HomepageModule[];
    }
  });

  const handleImageClick = () => {
    console.log("Image clicked");
  };

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
        <div className="text-xl text-red-600">Une erreur est survenue lors du chargement de la page</div>
      </div>
    );
  }

  if (!modules || modules.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Aucun module actif</div>
      </div>
    );
  }

  console.log('Modules to render:', modules); // Debug log

  return (
    <div className="min-h-screen">
      {modules
        .sort((a, b) => a.order_index - b.order_index)
        .map((module) => {
          console.log('Rendering module:', module); // Debug log for each module
          switch (module.module_type) {
            case 'hero':
              return (
                <HeroSection 
                  key={module.id} 
                  heroSection={module.content}
                  onImageClick={handleImageClick}
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
              console.log('Unknown module type:', module.module_type);
              return null;
          }
        })}
    </div>
  );
}