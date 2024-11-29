import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { GlobalStats } from "@/components/Statistics/GlobalStats";
import { DonationList } from "@/components/Donations/DonationList";
import { DonationStats } from "@/components/Donations/DonationStats";
import { HandCoins } from "lucide-react";

const PublicDonations = () => {
  const { data: donations, isLoading } = useQuery({
    queryKey: ['public-donations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('*, donation_items(*), donors(*)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <HandCoins className="h-8 w-8 text-primary" />
          Dons et Impact
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Découvrez comment nos dons transforment des vies à Cuba. Chaque contribution compte et fait une réelle différence dans la vie des enfants.
        </p>
      </div>

      <DonationStats donations={donations || []} />
      
      <Card className="p-6">
        <DonationList donations={donations || []} isLoading={isLoading} />
      </Card>
    </div>
  );
};

export default PublicDonations;