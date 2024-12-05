import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChildrenFilters } from "@/components/Children/ChildrenFilters";
import { ChildCard } from "@/components/Children/AvailableChildrenList/ChildCard";
import { useState } from "react";
import { differenceInYears, parseISO } from "date-fns";
import { Loader2 } from "lucide-react";
import { convertJsonToNeeds } from "@/types/needs";

const AvailableChildren = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedAge, setSelectedAge] = useState("all");
  const [selectedStatus] = useState("available");

  const { data: children, isLoading } = useQuery({
    queryKey: ['available-children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('is_sponsored', false)
        .order('name');

      if (error) throw error;
      
      // Convert needs from Json to Need[]
      return data.map(child => ({
        ...child,
        needs: convertJsonToNeeds(child.needs)
      }));
    }
  });

  const cities = Array.from(new Set(children?.map(child => child.city) || [])).filter(Boolean);
  const ages = Array.from(new Set(children?.map(child => {
    const age = differenceInYears(new Date(), parseISO(child.birth_date));
    return age;
  }) || [])).filter(Boolean).sort((a, b) => a - b);

  const filteredChildren = children?.filter(child => {
    const matchesSearch = child.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === "all" || child.city === selectedCity;
    const matchesGender = selectedGender === "all" || child.gender === selectedGender;
    const matchesAge = selectedAge === "all" || differenceInYears(new Date(), parseISO(child.birth_date)) === parseInt(selectedAge);
    
    return matchesSearch && matchesCity && matchesGender && matchesAge;
  });

  const handleViewProfile = (id: string) => {
    navigate(`/become-sponsor/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {t("availableChildren")}
        </h1>
        <p className="text-gray-600">
          {t("availableChildrenDescription")}
        </p>
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
        onStatusChange={() => {}}
        cities={cities}
        ages={ages}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredChildren?.map((child) => (
          <ChildCard
            key={child.id}
            child={child}
            onViewProfile={handleViewProfile}
          />
        ))}
      </div>
    </div>
  );
};

export default AvailableChildren;