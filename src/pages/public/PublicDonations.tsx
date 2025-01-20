import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "@/components/ErrorAlert";
import { DonationFilters } from "@/components/Donations/DonationFilters";
import { AnimatePresence } from "framer-motion";
import { DonationsHeader } from "@/components/Donations/PublicDonations/DonationsHeader";
import { ImpactSection } from "@/components/Donations/PublicDonations/ImpactSection";
import { DonationsList } from "@/components/Donations/PublicDonations/DonationsList";

const PublicDonations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("date");

  const { data: donations, isLoading, error, refetch } = useQuery({
    queryKey: ['public-donations'],
    queryFn: async () => {
      const { data: donationsData, error: donationsError } = await supabase
        .from('donations')
        .select('*')
        .eq('status', 'completed')
        .order('donation_date', { ascending: false });
      
      if (donationsError) throw donationsError;

      const donationsWithDonors = await Promise.all(
        donationsData.map(async (donation) => {
          const { data: donors } = await supabase
            .from('donors')
            .select('name, is_anonymous')
            .eq('donation_id', donation.id)
            .single();

          return {
            ...donation,
            donors: donors ? [donors] : []
          };
        })
      );
      
      return donationsWithDonors;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000 // Keep data in cache for 10 minutes
  });

  const filteredDonations = donations?.filter(donation => {
    const matchesSearch = 
      donation.assistant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.comments?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = cityFilter === "all" || donation.city === cityFilter;
    
    return matchesSearch && matchesCity;
  });

  const sortedDonations = filteredDonations?.sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.donation_date).getTime() - new Date(a.donation_date).getTime();
      case "peopleHelped":
        return b.people_helped - a.people_helped;
      case "city":
        return a.city.localeCompare(b.city);
      default:
        return 0;
    }
  });

  const cities = donations ? [...new Set(donations.map(d => d.city))].sort() : [];

  if (error) {
    return (
      <div className="container mx-auto px-0 sm:px-4 py-8">
        <ErrorAlert 
          message="Une erreur est survenue lors du chargement des dons"
          retry={() => refetch()}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-0 sm:px-4 py-8 space-y-8">
        <div className="animate-pulse">
          <Skeleton className="h-12 w-2/3 mb-4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-32 w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige to-white">
      <div className="container mx-auto px-0 sm:px-4 py-12 space-y-12">
        <AnimatePresence>
          <DonationsHeader />
          
          {donations && <ImpactSection donations={donations} />}

          <div className="bg-white/80 backdrop-blur-sm rounded-none sm:rounded-xl shadow-lg p-4 sm:p-8 border-0 sm:border sm:border-cuba-turquoise/20">
            <div className="space-y-6">
              <DonationFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                cityFilter={cityFilter}
                onCityFilterChange={setCityFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                cities={cities}
              />

              <DonationsList 
                donations={sortedDonations} 
                viewMode={viewMode}
                isPublicView={true}
              />
            </div>
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PublicDonations;