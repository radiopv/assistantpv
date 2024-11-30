import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, List, Grid, Search, Globe } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "@/components/ErrorAlert";
import { DonationForm } from "@/components/Donations/DonationForm";
import { DonationCard } from "@/components/Donations/DonationCard";
import { SearchInput } from "@/components/ui/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { translations } from "@/components/Donations/translations";
import { DonationStats } from "@/components/Donations/DonationStats";
import { DonationFilters } from "@/components/Donations/DonationFilters";
import { DonationList } from "@/components/Donations/DonationList";

const Donations = () => {
  const [showForm, setShowForm] = useState(false);
  const [language, setLanguage] = useState<"fr" | "es">("fr");
  
  const toggleLanguage = () => {
    setLanguage(prev => prev === "fr" ? "es" : "fr");
  };

  const { data: donations, isLoading, error, refetch } = useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      const { data: donationsData, error: donationsError } = await supabase
        .from('donations')
        .select('*')
        .order('donation_date', { ascending: false });
      
      if (donationsError) throw donationsError;
      return donationsData;
    }
  });

  if (error) {
    return <ErrorAlert message="Une erreur est survenue lors du chargement des dons" retry={() => refetch()} />;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <Skeleton className="h-10 w-40" />
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{translations[language].pageTitle}</h1>
          <p className="text-gray-600 mt-2">{translations[language].pageDescription}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus className="w-4 h-4 mr-2" />
            {showForm ? translations[language].close : translations[language].addDonation}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleLanguage}>
            <Globe className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {donations && <DonationStats donations={donations} language={language} />}

      {showForm && (
        <DonationForm 
          onDonationComplete={() => {
            setShowForm(false);
            refetch();
          }}
          language={language}
        />
      )}

      <DonationList 
        donations={donations} 
        onDelete={refetch}
        language={language}
      />
    </div>
  );
};

export default Donations;