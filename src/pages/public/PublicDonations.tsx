import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "@/components/ErrorAlert";
import { DonationCard } from "@/components/Donations/DonationCard";
import { useState } from "react";
import { DonationStats } from "@/components/Donations/DonationStats";
import { DonationFilters } from "@/components/Donations/DonationFilters";
import { useLanguage } from "@/contexts/LanguageContext";

const PublicDonations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("date");
  const { language } = useLanguage();

  const translations = {
    fr: {
      donationsTitle: "Nos actions sur le terrain",
      donationsSubtitle: "Découvrez toutes les actions menées par nos assistants à Cuba",
      noDonationsFound: "Aucun don trouvé",
      loading: "Chargement...",
      error: "Une erreur est survenue"
    },
    es: {
      donationsTitle: "Nuestras acciones en el terreno",
      donationsSubtitle: "Descubra todas las acciones llevadas a cabo por nuestros asistentes en Cuba",
      noDonationsFound: "No se encontraron donaciones",
      loading: "Cargando...",
      error: "Ha ocurrido un error"
    }
  };

  const t = translations[language as keyof typeof translations];
  
  const { data: donations, isLoading, error, refetch } = useQuery({
    queryKey: ['public-donations'],
    queryFn: async () => {
      const { data: donationsData, error: donationsError } = await supabase
        .from('donations')
        .select('*')
        .order('donation_date', { ascending: false });
      
      if (donationsError) throw donationsError;

      const donationsWithItems = await Promise.all(
        donationsData.map(async (donation) => {
          const { data: items } = await supabase
            .from('donation_items_with_categories')
            .select('*')
            .eq('donation_id', donation.id);

          const { data: donors } = await supabase
            .from('donors')
            .select('name, is_anonymous')
            .eq('donation_id', donation.id);

          return {
            ...donation,
            items: items || [],
            donors: donors || []
          };
        })
      );
      
      return donationsWithItems;
    }
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
      <div className="container mx-auto px-4 py-8">
        <ErrorAlert 
          message={t.error}
          retry={() => refetch()}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <Card className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t.donationsTitle}</h1>
        <p className="text-gray-600 mt-2">{t.donationsSubtitle}</p>
      </div>

      {donations && <DonationStats donations={donations} />}

      <Card className="p-6">
        <div className="space-y-4">
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

          {sortedDonations && sortedDonations.length > 0 ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
              {sortedDonations.map((donation) => (
                <DonationCard 
                  key={donation.id} 
                  donation={donation}
                  onDelete={refetch}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              {t.noDonationsFound}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PublicDonations;