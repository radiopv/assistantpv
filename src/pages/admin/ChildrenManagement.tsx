import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChildrenTable } from "@/components/Children/ChildrenTable";
import { ChildrenList } from "@/components/Children/ChildrenList";
import { ChildrenFilters } from "@/components/Children/ChildrenFilters";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

export default function ChildrenManagement() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [view, setView] = useState<"grid" | "table">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedAge, setSelectedAge] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const { data: children, isLoading } = useQuery({
    queryKey: ["admin-children", selectedCity, selectedGender, selectedAge, selectedStatus],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("children")
        .select("*");

      if (error) throw error;
      return data;
    }
  });

  const handleViewProfile = (id: string) => {
    navigate(`/child/${id}`);
  };

  const handleSponsorClick = (child: any) => {
    // Implement sponsor click logic
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t("childrenManagement")}</h1>

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

      <Tabs value={view} onValueChange={(v) => setView(v as "grid" | "table")}>
        <TabsList>
          <TabsTrigger value="grid">{t("gridView")}</TabsTrigger>
          <TabsTrigger value="table">{t("tableView")}</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <ChildrenList 
            children={children || []} 
            isLoading={isLoading}
            onViewProfile={handleViewProfile}
          />
        </TabsContent>

        <TabsContent value="table">
          <ChildrenTable 
            children={children || []} 
            onViewProfile={handleViewProfile}
            onSponsorClick={handleSponsorClick}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}