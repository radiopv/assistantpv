import { CallToAction } from "@/components/Home/CallToAction";
import { FeaturedChildren } from "@/components/Home/FeaturedChildren";
import { HowItWorks } from "@/components/Home/HowItWorks";
import { FeaturedAlbum } from "@/components/Home/FeaturedAlbum";
import { FeaturedTestimonials } from "@/components/Home/FeaturedTestimonials";
import { HeroSection } from "@/components/Home/HeroSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ImpactStats } from "@/components/Home/ImpactStats";

const Home = () => {
  const { data: modules } = useQuery({
    queryKey: ['homepage-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_modules')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (error) throw error;
      return data;
    }
  });

  const renderModule = (module: any) => {
    switch (module.module_type) {
      case 'hero':
        return <HeroSection key={module.id} heroSection={module.settings} />;
      case 'impact-stats':
        return <ImpactStats key={module.id} settings={module.settings} />;
      // Ajoutez d'autres cas pour les autres types de modules
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige to-white">
      {/* Render active modules */}
      {modules?.map(module => renderModule(module))}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-24">
        <CallToAction />
        <FeaturedChildren />
        <HowItWorks />
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 font-title">
            Nos derniers souvenirs
          </h2>
          <FeaturedAlbum />
        </section>
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 font-title">
            Témoignages de nos parrains
          </h2>
          <FeaturedTestimonials />
        </section>
      </div>
    </div>
  );
};

export default Home;