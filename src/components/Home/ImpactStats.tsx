import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface ImpactStatsProps {
  settings: {
    title: string;
    showTotalSponsors: boolean;
    showTotalChildren: boolean;
    showTotalDonations: boolean;
    animateNumbers: boolean;
    backgroundStyle: string;
  };
}

export const ImpactStats = ({ settings }: ImpactStatsProps) => {
  const { data: stats } = useQuery({
    queryKey: ['impact-stats'],
    queryFn: async () => {
      const { data: sponsorCount } = await supabase
        .from('sponsors')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'sponsor')
        .eq('is_active', true);

      const { data: childrenCount } = await supabase
        .from('children')
        .select('*', { count: 'exact', head: true })
        .eq('is_sponsored', true);

      const { data: donationsCount } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true });

      return {
        totalSponsors: sponsorCount?.count || 0,
        totalChildren: childrenCount?.count || 0,
        totalDonations: donationsCount?.count || 0
      };
    }
  });

  return (
    <section className="py-16 bg-gradient-to-r from-[#0072BB] to-[#F9B612]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-12">
          {settings.title || "Notre Impact"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {settings.showTotalSponsors && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center p-6 bg-white/10 backdrop-blur-md rounded-lg"
            >
              <p className="text-5xl font-bold text-white mb-2">
                {stats?.totalSponsors || 0}
              </p>
              <p className="text-xl text-white/90">Parrains Actifs</p>
            </motion.div>
          )}

          {settings.showTotalChildren && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center p-6 bg-white/10 backdrop-blur-md rounded-lg"
            >
              <p className="text-5xl font-bold text-white mb-2">
                {stats?.totalChildren || 0}
              </p>
              <p className="text-xl text-white/90">Enfants Parrainés</p>
            </motion.div>
          )}

          {settings.showTotalDonations && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center p-6 bg-white/10 backdrop-blur-md rounded-lg"
            >
              <p className="text-5xl font-bold text-white mb-2">
                {stats?.totalDonations || 0}
              </p>
              <p className="text-xl text-white/90">Dons Réalisés</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};