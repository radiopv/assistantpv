import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { ChildrenFilters } from "@/components/Children/ChildrenFilters";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

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
    if (!child.needs || !Array.isArray(child.needs)) return false;
    return child.needs.some((need: any) => need.is_urgent);
  };

  const filteredChildren = useMemo(() => {
    if (!children) return [];
    
    return children.filter(child => {
      const matchesSearch = child.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = selectedCity === "all" || child.city === selectedCity;
      const matchesGender = selectedGender === "all" || child.gender === selectedGender;
      const matchesAge = selectedAge === "all" || child.age === parseInt(selectedAge);
      const matchesStatus = selectedStatus === "all" || 
        (selectedStatus === "available" && !child.is_sponsored) ||
        (selectedStatus === "sponsored" && child.is_sponsored) ||
        (selectedStatus === "pending" && child.status === "pending") ||
        (selectedStatus === "urgent" && hasUrgentNeeds(child));
      
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredChildren.map((child) => (
          <Card 
            key={child.id} 
            className="p-4 cursor-pointer hover:shadow-lg transition-shadow active:scale-[0.98] touch-manipulation"
            onClick={() => navigate(`/children/${child.id}`)}
          >
            <div className="aspect-square relative mb-4 rounded-lg overflow-hidden bg-gray-100">
              {child.photo_url ? (
                <img 
                  src={child.photo_url} 
                  alt={child.name}
                  className="object-cover w-full h-full transition-opacity duration-300 lazy"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">Pas de photo</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{child.name}</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="min-h-[44px] flex items-center">Âge : {child.age} ans</p>
                <p className="min-h-[44px] flex items-center">
                  Genre : {child.gender === 'M' ? 'Masculin' : 'Féminin'}
                </p>
                <p className="min-h-[44px] flex items-center">Ville : {child.city}</p>
              </div>
              <div className="pt-2 flex flex-wrap gap-2">
                <span className={`px-3 py-2 rounded-full text-sm ${
                  child.is_sponsored 
                    ? 'bg-green-100 text-green-800' 
                    : child.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {child.is_sponsored ? 'Parrainé' : child.status === 'pending' ? 'En attente' : 'Disponible'}
                </span>
                {hasUrgentNeeds(child) && (
                  <span className="px-3 py-2 rounded-full text-sm bg-red-100 text-red-800">
                    Besoins urgents
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Children;