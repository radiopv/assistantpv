import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { ChildrenFilters } from "@/components/Children/ChildrenFilters";
import { ChildrenList } from "@/components/Children/ChildrenList";
import { toast } from "sonner";

const AvailableChildren = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedAge, setSelectedAge] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("available");

  // Fetch only available children
  const { data: children, isLoading } = useQuery({
    queryKey: ['available-children'],
    queryFn: async () => {
      const query = supabase
        .from('children')
        .select('*')
        .eq('status', 'available')
        .order('name', { ascending: true });

      const { data, error } = await query;

      if (error) {
        toast.error("Erreur lors du chargement des enfants");
        throw error;
      }
      return data;
    }
  });

  const cities = Array.from(new Set(children?.map(child => child.city) || [])).filter(Boolean).sort();
  const ages = Array.from(new Set(children?.map(child => child.age) || [])).filter(Boolean).sort((a, b) => a - b);

  const filteredChildren = children?.filter(child => {
    const matchesSearch = child.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === "all" || child.city === selectedCity;
    const matchesGender = selectedGender === "all" || child.gender === selectedGender;
    const matchesAge = selectedAge === "all" || child.age === parseInt(selectedAge);
    
    return matchesSearch && matchesCity && matchesGender && matchesAge;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Enfants disponibles au parrainage</h1>
      </div>

      <ChildrenFilters
        searchTerm={searchTerm}
        selectedCity={selectedCity}
        selectedGender={selectedGender}
        selectedAge={selectedAge}
        selectedStatus={selectedStatus}
        onSearchChange={setSearchTerm}
        onCityChange={setSelectedCity}
        onGenderChange={setSelectedGender}
        onAgeChange={setSelectedAge}
        onStatusChange={setSelectedStatus}
        cities={cities}
        ages={ages}
      />

      <ChildrenList 
        children={filteredChildren || []}
        isLoading={isLoading}
        onViewProfile={(id) => navigate(`/enfant/${id}`)}
      />
    </div>
  );
};

export default AvailableChildren;