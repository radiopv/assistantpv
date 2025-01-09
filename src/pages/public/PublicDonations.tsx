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
import { motion } from "framer-motion";

const PublicDonations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("date");
  const { language } = useLanguage();

  const translations = {
    fr: {
      donationsTitle: "Nos actions sur le terrain",
      donationsSubtitle: "Découvrez l'impact de nos actions à Cuba grâce à nos assistants dévoués",
      noDonationsFound: "Aucun don trouvé",
      loading: "Chargement...",
      error: "Une erreur est survenue",
      impactTitle: "Notre Impact",
      impactSubtitle: "Ensemble, nous faisons la différence"
    },
    es: {
      donationsTitle: "Nuestras acciones en el terreno",
      donationsSubtitle: "Descubra el impacto de nuestras acciones en Cuba gracias a nuestros asistentes dedicados",
      noDonationsFound: "No se encontraron donaciones",
      loading: "Cargando...",
      error: "Ha ocurrido un error",
      impactTitle: "Nuestro Impacto",
      impactSubtitle: "Juntos hacemos la diferencia"
    }
  };

  const t = translations[language as keyof typeof translations];
  
  const { data: donations, isLoading, error, refetch } = useQuery({
    queryKey: ['public-donations'],
    queryFn: async () => {
      const { data: donationsData, error: donationsError } = await supabase
        .from('donations')
        .select('*')
        .eq('status', 'completed')
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
      <div className="container mx-auto px-4 py-8 space-y-8">
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
    <div className="min-h-screen bg-gradient-to-b from-cuba-offwhite to-white">
      <div className="container mx-auto px-4 py-12 space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-title">
            {t.donationsTitle}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.donationsSubtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-cuba-gradient text-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{t.impactTitle}</h2>
            <p className="mb-6 text-white/90">{t.impactSubtitle}</p>
            {donations && <DonationStats donations={donations} />}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
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

            {sortedDonations && sortedDonations.length > 0 ? (
              <motion.div 
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {sortedDonations.map((donation) => (
                  <motion.div
                    key={donation.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <DonationCard 
                      donation={donation}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-600 py-12"
              >
                {t.noDonationsFound}
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicDonations;