import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChildrenFilters } from "@/components/Children/ChildrenFilters";
import { ChildCard } from "@/components/Children/ChildCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AvailableChildren() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedAge, setSelectedAge] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const { data: children, isLoading } = useQuery({
    queryKey: ["available-children", selectedCity, selectedGender, selectedAge],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("status", "available");

      if (error) throw error;
      return data;
    }
  });

  const handleViewProfile = (id: string) => {
    navigate(`/child/${id}`);
  };

  const handleSponsorClick = () => {
    // Implement sponsor click logic
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t("availableChildren")}</h1>
      
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
        cities={[]}
        ages={[]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children?.map((child) => (
          <ChildCard
            key={child.id}
            child={child}
            onViewProfile={handleViewProfile}
            onSponsorClick={handleSponsorClick}
          />
        ))}
      </div>
    </div>
  );
}