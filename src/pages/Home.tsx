import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HeroSection } from "@/components/Home/HeroSection";
import { ImpactStats } from "@/components/Home/ImpactStats";

export default function Home() {
  const { data: modules } = useQuery({
    queryKey: ['homepage-modules'],
    queryFn: async () => {
      const { data } = await supabase
        .from('homepage_modules')
        .select('*')
        .eq('is_active', true)
        .order('order_index');
      return data;
    }
  });

  const handleImageClick = () => {
    // Add your image click handler logic here
    console.log("Image clicked");
  };

  return (
    <div className="min-h-screen">
      {modules?.map((module) => {
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
                settings={module.settings || {
                  title: "Notre Impact",
                  showTotalSponsors: true,
                  showTotalChildren: true,
                  showTotalDonations: true,
                  animateNumbers: true,
                  backgroundStyle: "gradient"
                }}
              />
            );
          case 'other_module_type': // Replace with actual module type if needed
            return (
              // Add your other module rendering logic here
              <div key={module.id}>Other Module Content</div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
