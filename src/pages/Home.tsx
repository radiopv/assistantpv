import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Hero } from "@/components/Home/Hero";
import { FeaturedChildren } from "@/components/Home/FeaturedChildren";
import { CTA } from "@/components/Home/CTA";
import { toast } from "sonner";

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
  const { data: modules, isLoading, error } = useQuery({
    queryKey: ['homepage-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_modules')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (error) {
        console.error('Error fetching homepage modules:', error);
        toast.error("Erreur lors du chargement de la page");
        throw error;
      }

      return data as HomepageModule[];
    }
  });

  if (error) {
    console.error('Error in Home component:', error);
    return <div>Une erreur est survenue lors du chargement de la page</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige/20 to-cuba-offwhite">
      <Hero />
      <FeaturedChildren />
      <CTA />
    </div>
  );
}