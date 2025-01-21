import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Hero } from "@/components/Home/Hero";
import { FeaturedChildren } from "@/components/Home/FeaturedChildren";
import { CTA } from "@/components/Home/CTA";
import { handleError } from "@/utils/error-handler";
import { ErrorAlert } from "@/components/ErrorAlert";

interface HomepageModule {
  id: string;
  name: string;
  module_type: string;
  is_active: boolean;
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
    steps?: { title: string; description: string; }[];
    showProgressBar?: boolean;
  };
  order_index: number;
}

export default function Home() {
  const { data: modules, isLoading, error, refetch } = useQuery({
    queryKey: ['homepage-modules'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('homepage_modules')
          .select('*')
          .eq('is_active', true)
          .order('order_index');

        if (error) throw error;

        return data as unknown as HomepageModule[];
      } catch (error) {
        handleError(error, "Erreur lors du chargement de la page");
        throw error;
      }
    }
  });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorAlert 
          message="Une erreur est survenue lors du chargement de la page" 
          retry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige/20 to-cuba-offwhite">
      <Hero />
      <FeaturedChildren />
      <CTA />
    </div>
  );
}