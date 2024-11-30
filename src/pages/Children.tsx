import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChildrenList } from "@/components/Children/ChildrenList";
import { ChildrenFilters } from "@/components/Children/ChildrenFilters";
import { ChildrenHeader } from "@/components/Children/ChildrenHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Children = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    status: "",
    city: "",
    searchTerm: "",
    sortBy: "name"
  });

  const { data: children, isLoading } = useQuery({
    queryKey: ['children', filters],
    queryFn: async () => {
      let query = supabase
        .from('children')
        .select(`
          *,
          sponsorships (
            id,
            status,
            sponsor:sponsors (
              name,
              email
            )
          )
        `);

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.city) {
        query = query.eq('city', filters.city);
      }

      if (filters.searchTerm) {
        query = query.ilike('name', `%${filters.searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        toast.error("Erreur lors du chargement des enfants");
        throw error;
      }

      return data;
    }
  });

  const sortedChildren = [...(children || [])].sort((a, b) => {
    switch (filters.sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "age":
        return a.age - b.age;
      case "city":
        return a.city?.localeCompare(b.city || "");
      default:
        return 0;
    }
  });

  const handleAddChild = () => {
    navigate("/children/add");
  };

  const handleViewProfile = (id: string) => {
    navigate(`/children/${id}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-12 w-48" />
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <ChildrenHeader onAddChild={handleAddChild} />
      <ChildrenFilters 
        searchTerm={filters.searchTerm}
        selectedCity={filters.city}
        selectedGender=""
        selectedAge=""
        selectedStatus={filters.status}
        onSearchChange={(value) => setFilters(prev => ({ ...prev, searchTerm: value }))}
        onCityChange={(value) => setFilters(prev => ({ ...prev, city: value }))}
        onGenderChange={() => {}}
        onAgeChange={() => {}}
        onStatusChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
        cities={[...new Set(children?.map(c => c.city) || [])]}
        ages={[...new Set(children?.map(c => c.age) || [])]}
      />
      <ChildrenList 
        children={sortedChildren} 
        isLoading={isLoading}
        onViewProfile={handleViewProfile}
      />
    </div>
  );
};

export default Children;