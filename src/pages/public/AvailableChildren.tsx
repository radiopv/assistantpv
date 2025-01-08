import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChildrenFilters } from "@/components/Children/ChildrenFilters";
import { ChildCard } from "@/components/Children/ChildCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

export default function AvailableChildren() {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    ageRange: [0, 18],
    gender: "",
    city: "",
    hasNeeds: false,
    hasUrgentNeeds: false
  });

  const { data: children, isLoading } = useQuery({
    queryKey: ["available-children", filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("status", "available");

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div className="container mx-auto p-4">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t("availableChildren")}</h1>
      
      <ChildrenFilters
        filters={filters}
        onChange={setFilters}
        className="mb-6"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children?.map((child) => (
          <ChildCard
            key={child.id}
            child={child}
            onViewProfile={() => {}}
            onSponsorClick={() => {}}
            readOnly
          />
        ))}
      </div>
    </div>
  );
}