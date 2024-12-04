import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { BarChart, LineChart } from "lucide-react";
import { DonationTrends } from "@/components/Statistics/DonationTrends";
import { CityStats } from "@/components/Statistics/CityStats";
import { GlobalStats } from "@/components/Statistics/GlobalStats";

const PublicStats = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <LineChart className="h-8 w-8 text-primary" />
          Statistiques et Impact
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Découvrez l'impact de nos actions et l'évolution de notre programme de parrainage à travers ces statistiques.
        </p>
      </div>

      <GlobalStats />
      <DonationTrends />
      <CityStats />
    </div>
  );
};

export default PublicStats;