import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { ChildrenFilters } from "@/components/Children/ChildrenFilters";
import { toast } from "sonner";

const Children = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedAge, setSelectedAge] = useState("");

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

  const filteredChildren = useMemo(() => {
    if (!children) return [];
    
    return children.filter(child => {
      const matchesSearch = child.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = !selectedCity || child.city === selectedCity;
      const matchesGender = !selectedGender || child.gender === selectedGender;
      const matchesAge = !selectedAge || child.age === parseInt(selectedAge);
      
      return matchesSearch && matchesCity && matchesGender && matchesAge;
    });
  }, [children, searchTerm, selectedCity, selectedGender, selectedAge]);

  const checkDuplicates = (childId: string) => {
    if (!children) return;
    
    const currentChild = children.find(c => c.id === childId);
    if (!currentChild) return;
    
    const potentialDuplicates = children.filter(c => 
      c.id !== childId && (
        c.name.toLowerCase() === currentChild.name.toLowerCase() ||
        (c.age === currentChild.age && c.gender === currentChild.gender && c.city === currentChild.city)
      )
    );

    if (potentialDuplicates.length > 0) {
      toast.warning("Attention : Profils similaires détectés", {
        description: "Il existe des profils avec des informations similaires.",
        duration: 5000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des enfants</h1>
        <Button onClick={() => navigate('/children/add')}>
          Ajouter un enfant
        </Button>
      </div>

      <ChildrenFilters
        searchTerm={searchTerm}
        selectedCity={selectedCity}
        selectedGender={selectedGender}
        selectedAge={selectedAge}
        onSearchChange={setSearchTerm}
        onCityChange={setSelectedCity}
        onGenderChange={setSelectedGender}
        onAgeChange={setSelectedAge}
        cities={cities}
        ages={ages}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredChildren.map((child) => (
          <Card 
            key={child.id} 
            className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              checkDuplicates(child.id);
              navigate(`/children/${child.id}`);
            }}
          >
            <div className="aspect-square relative mb-4 rounded-lg overflow-hidden">
              {child.photo_url ? (
                <img 
                  src={child.photo_url} 
                  alt={child.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Pas de photo</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{child.name}</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Âge : {child.age} ans</p>
                <p>Genre : {child.gender === 'M' ? 'Masculin' : 'Féminin'}</p>
                <p>Ville : {child.city}</p>
              </div>
              <div className="pt-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  child.is_sponsored 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {child.is_sponsored ? 'Parrainé' : 'Disponible'}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Children;