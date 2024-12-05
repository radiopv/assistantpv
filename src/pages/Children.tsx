import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { ChildrenFilters } from "@/components/Children/ChildrenFilters";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChildrenList } from "@/components/Children/ChildrenList";

const Children = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedAge, setSelectedAge] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const { data: children, isLoading } = useQuery({
    queryKey: ['children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        toast.error("Erreur lors du chargement des enfants");
        throw error;
      }

      return data;
    }
  });

  const cities = useMemo(() => {
    if (!children) return [];
    const uniqueCities = [...new Set(children.map(child => child.city))];
    return uniqueCities.filter(Boolean).sort();
  }, [children]);

  const ages = useMemo(() => {
    if (!children) return [];
    const uniqueAges = [...new Set(children.map(child => child.age))];
    return uniqueAges.filter(Boolean).sort((a, b) => a - b);
  }, [children]);

  const hasUrgentNeeds = (child: any) => {
    if (!child.needs) return false;
    const needs = typeof child.needs === 'string' ? JSON.parse(child.needs) : child.needs;
    return Array.isArray(needs) && needs.some((need: any) => need.is_urgent);
  };

  const filteredChildren = useMemo(() => {
    if (!children) return [];
    
    return children.filter(child => {
      const matchesSearch = child.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = selectedCity === "all" || child.city === selectedCity;
      const matchesGender = selectedGender === "all" || child.gender === selectedGender;
      const matchesAge = selectedAge === "all" || child.age === parseInt(selectedAge);
      
      let matchesStatus = true;
      if (selectedStatus !== "all") {
        switch (selectedStatus) {
          case "available":
            matchesStatus = !child.is_sponsored;
            break;
          case "sponsored":
            matchesStatus = child.is_sponsored;
            break;
          case "pending":
            matchesStatus = child.status === "En attente";
            break;
          case "urgent":
            matchesStatus = hasUrgentNeeds(child);
            break;
        }
      }
      
      return matchesSearch && matchesCity && matchesGender && matchesAge && matchesStatus;
    });
  }, [children, searchTerm, selectedCity, selectedGender, selectedAge, selectedStatus]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Liste des enfants</h1>
        <Button 
          onClick={() => navigate('/children/add')}
          className="w-full sm:w-auto min-h-[44px]"
        >
          Ajouter un enfant
        </Button>
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
        children={filteredChildren}
        isLoading={isLoading}
        onViewProfile={(id) => navigate(`/children/${id}`)}
      />
    </div>
  );
};

export default Children;
