import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { DonationCard } from "@/components/Donations/DonationCard";

const PublicDonations = () => {
  const { data: donations, isLoading } = useQuery({
    queryKey: ['public-donations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('donation_date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="grid gap-4 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900">Nos dons</h1>
      <p className="text-gray-600 mt-2">
        Découvrez les dons effectués par notre association pour aider les enfants.
      </p>

      <div className="grid gap-6 mt-8">
        {donations?.map((donation) => (
          <DonationCard 
            key={donation.id} 
            donation={donation}
            language="fr"
          />
        ))}
      </div>
    </div>
  );
};

export default PublicDonations;