import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChildrenFilters } from "@/components/Children/ChildrenFilters";
import { ChildrenList } from "@/components/Children/ChildrenList";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

const PublicChildren = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedAge, setSelectedAge] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("available");

  const { data: children, isLoading } = useQuery({
    queryKey: ['public-children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching children:', error);
        return [];
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
    const matchesStatus = selectedStatus === "all" || 
      (selectedStatus === "available" && !child.is_sponsored) ||
      (selectedStatus === "sponsored" && child.is_sponsored);

    return matchesSearch && matchesCity && matchesGender && matchesAge && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">{t("childrenList")}</h1>
        <p className="text-gray-600">{t("findChildToSponsor")}</p>
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
        onViewProfile={(id) => window.location.href = `/children/${id}`}
      />
    </div>
  );
};

export default PublicChildren;