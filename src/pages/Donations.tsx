import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, List, Grid, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "@/components/ErrorAlert";
import { DonationForm } from "@/components/Donations/DonationForm";
import { DonationCard } from "@/components/Donations/DonationCard";
import { useState } from "react";
import { SearchInput } from "@/components/ui/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DonationStats = ({ donations }: { donations: any[] }) => {
  const totalDonations = donations.length;
  const totalPeopleHelped = donations.reduce((acc, don) => acc + don.people_helped, 0);
  const cities = new Set(donations.map(d => d.city)).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-4 bg-primary/5">
        <p className="text-sm text-gray-500">Total des dons</p>
        <p className="text-2xl font-bold">{totalDonations}</p>
      </Card>
      <Card className="p-4 bg-primary/5">
        <p className="text-sm text-gray-500">Personnes aidées</p>
        <p className="text-2xl font-bold">{totalPeopleHelped}</p>
      </Card>
      <Card className="p-4 bg-primary/5">
        <p className="text-sm text-gray-500">Villes touchées</p>
        <p className="text-2xl font-bold">{cities}</p>
      </Card>
    </div>
  );
};

const Donations = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("date");
  
  const { data: donations, isLoading, error, refetch } = useQuery({
    queryKey: ['donations'],
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
    
    const matchesCity = !cityFilter || donation.city === cityFilter;
    
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
      <div className="space-y-6">
        <ErrorAlert 
          message="Une erreur est survenue lors du chargement des dons" 
          retry={() => refetch()}
        />
      </div>
    );
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
          <h1 className="text-3xl font-bold text-gray-900">Dons</h1>
          <p className="text-gray-600 mt-2">Gérez les dons et leur distribution</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? "Fermer" : "Ajouter un don"}
        </Button>
      </div>

      {donations && <DonationStats donations={donations} />}

      {showForm && (
        <DonationForm onDonationComplete={() => {
          setShowForm(false);
          refetch();
        }} />
      )}

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchInput
                placeholder="Rechercher par ville, assistant ou commentaires..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                icon={Search}
              />
            </div>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrer par ville" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les villes</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="peopleHelped">Personnes aidées</SelectItem>
                <SelectItem value="city">Ville</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

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
              Aucun don ne correspond à vos critères de recherche
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Donations;