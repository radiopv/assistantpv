import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const filteredChildren = children?.filter(child => {
    const matchesSearch = child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         child.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !selectedCity || child.city === selectedCity;
    const matchesGender = !selectedGender || child.gender === selectedGender;
    const matchesAge = !selectedAge || child.age === parseInt(selectedAge);

    return matchesSearch && matchesCity && matchesGender && matchesAge;
  });

  const cities = [...new Set(children?.map(child => child.city).filter(Boolean) || [])];
  const ages = [...new Set(children?.map(child => child.age).filter(Boolean) || [])].sort((a, b) => a - b);

  const renderSkeletons = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="p-4 space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-full" />
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Enfants</h1>
          <p className="text-gray-600">Gérez les profils des enfants</p>
        </div>
        <Button onClick={() => navigate('/children/add')} className="w-full md:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un enfant
        </Button>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par ville" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les villes</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedGender} onValueChange={setSelectedGender}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les genres</SelectItem>
            <SelectItem value="M">Masculin</SelectItem>
            <SelectItem value="F">Féminin</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedAge} onValueChange={setSelectedAge}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par âge" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les âges</SelectItem>
            {ages.map((age) => (
              <SelectItem key={age} value={age.toString()}>{age} ans</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Children List */}
      {isLoading ? (
        renderSkeletons()
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredChildren?.map((child) => (
            <Card key={child.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={child.photo_url || "/placeholder.svg"}
                  alt={child.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{child.name}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{child.age} ans</p>
                    <p>{child.city}</p>
                    <p>{child.gender === 'M' ? 'Masculin' : 'Féminin'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => navigate(`/children/${child.id}`)}
                  >
                    Voir le profil
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredChildren?.length === 0 && !isLoading && (
        <div className="text-center py-10">
          <p className="text-gray-500">Aucun enfant ne correspond aux critères de recherche</p>
        </div>
      )}
    </div>
  );
};

export default Children;