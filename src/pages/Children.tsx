import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChildrenList } from "@/components/Children/ChildrenList";
import { ChildrenFilters } from "@/components/Children/ChildrenFilters";
import { ChildrenHeader } from "@/components/Children/ChildrenHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ErrorAlert } from "@/components/ErrorAlert";

const Children = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedAge, setSelectedAge] = useState<string>("");

  const { data: children, isLoading, error, refetch } = useQuery({
    queryKey: ['children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const filteredChildren = children?.filter(child => {
    const matchesSearch = child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         child.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !selectedCity || child.city === selectedCity;
    const matchesGender = !selectedGender || child.gender === selectedGender;
    const matchesAge = !selectedAge || child.age === parseInt(selectedAge);

    return matchesSearch && matchesCity && matchesGender && matchesAge;
  });

  if (error) {
    return <ErrorAlert message="Une erreur est survenue lors du chargement des enfants" retry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <ChildrenHeader onAddChild={() => navigate('/children/add')} />
      <ChildrenFilters
        searchTerm={searchTerm}
        selectedCity={selectedCity}
        selectedGender={selectedGender}
        selectedAge={selectedAge}
        onSearchChange={setSearchTerm}
        onCityChange={setSelectedCity}
        onGenderChange={setSelectedGender}
        onAgeChange={setSelectedAge}
        cities={[...new Set(children?.map(child => child.city) || [])]}
        ages={[...new Set(children?.map(child => child.age) || [])].sort((a, b) => a - b)}
      />
      <ChildrenList 
        children={filteredChildren || []} 
        isLoading={isLoading} 
        onViewProfile={(id) => navigate(`/children/${id}`)}
      />
    </div>
  );
};

export default Children;