import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DonationList } from "@/components/Donations/DonationList";
import { DonationFilters } from "@/components/Donations/DonationFilters";
import { DonationHeader } from "@/components/Donations/DonationHeader";
import { DonationStats } from "@/components/Donations/DonationStats";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const Donations = () => {
  const [language, setLanguage] = useState<"fr" | "es">("fr");
  const [filters, setFilters] = useState({
    city: "",
    status: "",
    dateRange: null,
    searchTerm: "",
    sortBy: "date"
  });

  const { data: donations, isLoading } = useQuery({
    queryKey: ['donations', filters],
    queryFn: async () => {
      let query = supabase
        .from('donations')
        .select(`
          *,
          donation_items (
            id,
            quantity,
            category:aid_categories (
              name
            )
          ),
          donation_photos (
            id,
            url
          )
        `);

      if (filters.city) {
        query = query.eq('city', filters.city);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.searchTerm) {
        query = query.or(`
          assistant_name.ilike.%${filters.searchTerm}%,
          city.ilike.%${filters.searchTerm}%,
          comments.ilike.%${filters.searchTerm}%
        `);
      }

      const { data, error } = await query;

      if (error) {
        toast.error("Erreur lors du chargement des dons");
        throw error;
      }

      return data;
    }
  });

  const handleDelete = async () => {
    toast.success("Don supprimé avec succès");
    // Refresh data
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-12 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  const exampleDonation = {
    assistant_name: "Assistant",
    donation_date: new Date().toISOString(),
    status: "completed"
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <DonationHeader donation={exampleDonation} />
      <DonationStats donations={donations || []} language={language} />
      <DonationFilters 
        searchTerm={filters.searchTerm}
        cityFilter={filters.city}
        viewMode="grid"
        setViewMode={() => {}}
        sortBy={filters.sortBy}
        setSortBy={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
        cities={[...new Set(donations?.map(d => d.city) || [])]}
        language={language}
        setSearchTerm={(value) => setFilters(prev => ({ ...prev, searchTerm: value }))}
        setCityFilter={(value) => setFilters(prev => ({ ...prev, city: value }))}
      />
      <DonationList 
        donations={donations || []} 
        onDelete={handleDelete}
        language={language}
      />
    </div>
  );
};

export default Donations;