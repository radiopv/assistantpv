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
  const { data: modules } = useQuery({
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
      return (data || []).map(module => ({
        ...module,
        content: module.content as HomepageModule['content'],
        settings: {
          title: "Notre Impact",
          showTotalSponsors: true,
          showTotalChildren: true,
          showTotalDonations: true,
          animateNumbers: true,
          backgroundStyle: "gradient",
          ...(module.settings as Partial<HomepageModule['settings']>)
        },
        order_index: module.order_index || 0
      })) as HomepageModule[];
    }
  });

  const handleImageClick = () => {
    console.log("Image clicked");
  };

  if (!modules) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen">
      {modules
        .sort((a, b) => a.order_index - b.order_index)
        .map((module) => {
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
              return null;
          }
        })}
    </div>
  );
}