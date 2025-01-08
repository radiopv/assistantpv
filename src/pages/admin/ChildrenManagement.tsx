import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChildrenTable } from "@/components/Children/ChildrenTable";
import { ChildrenList } from "@/components/Children/ChildrenList";
import { ChildrenFilters } from "@/components/Children/ChildrenFilters";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ChildrenManagement() {
  const { t } = useLanguage();
  const [view, setView] = useState<"grid" | "table">("grid");
  const [filters, setFilters] = useState({
    ageRange: [0, 18],
    gender: "",
    city: "",
    hasNeeds: false,
    hasUrgentNeeds: false
  });

  const { data: children, isLoading } = useQuery({
    queryKey: ["admin-children", filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("children")
        .select("*");

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div className="container mx-auto p-4">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t("childrenManagement")}</h1>

      <ChildrenFilters
        filters={filters}
        onChange={setFilters}
        className="mb-6"
      />

      <Tabs value={view} onValueChange={(v) => setView(v as "grid" | "table")}>
        <TabsList>
          <TabsTrigger value="grid">{t("gridView")}</TabsTrigger>
          <TabsTrigger value="table">{t("tableView")}</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <ChildrenList children={children} />
        </TabsContent>

        <TabsContent value="table">
          <ChildrenTable children={children} />
        </TabsContent>
      </Tabs>
    </div>
  );
}