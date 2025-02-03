import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ContributionStatsProps {
  sponsorId: string;
}

interface DonationStats {
  totalDonations: number;
  donationCount: number;
}

export const ContributionStats = ({ sponsorId }: ContributionStatsProps) => {
  const { data: stats } = useQuery({
    queryKey: ['contribution-stats', sponsorId],
    queryFn: async (): Promise<DonationStats> => {
      console.log("Fetching donation stats for sponsor:", sponsorId);
      
      const { data: donations, error } = await supabase
        .from('donations')
        .select('people_helped')
        .eq('assistant_name', sponsorId);

      if (error) {
        console.error("Error fetching donations:", error);
        throw error;
      }

      console.log("Fetched donations:", donations);

      const totalDonations = donations?.reduce((sum, donation) => sum + (donation.people_helped || 0), 0) || 0;
      const donationCount = donations?.length || 0;

      return {
        totalDonations,
        donationCount
      };
    }
  });

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Statistiques de contributions</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Total des personnes aidées</p>
          <p className="text-2xl font-bold">{stats?.totalDonations || 0}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Nombre de dons</p>
          <p className="text-2xl font-bold">{stats?.donationCount || 0}</p>
        </div>
      </div>
    </Card>
  );
};