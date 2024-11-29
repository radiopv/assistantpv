import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { BarChart, ChartSquare } from "lucide-react";
import { DonationTrends } from "@/components/Statistics/DonationTrends";
import { CityStats } from "@/components/Statistics/CityStats";
import { GlobalStats } from "@/components/Statistics/GlobalStats";

const PublicStats = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <ChartSquare className="h-8 w-8 text-primary" />
          Statistiques et Impact
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Découvrez l'impact de notre action à travers les chiffres. Chaque statistique représente des vies changées grâce à votre soutien.
        </p>
      </div>

      <GlobalStats />

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart className="h-5 w-5 text-primary" />
            Tendances des Dons
          </h2>
          <DonationTrends />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Impact par Ville</h2>
          <CityStats />
        </Card>
      </div>
    </div>
  );
};

export default PublicStats;