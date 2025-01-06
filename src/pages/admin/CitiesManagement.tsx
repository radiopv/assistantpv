import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Settings, Edit, Save } from "lucide-react";
import { toast } from "sonner";
import { SearchInput } from "@/components/ui/search-input";

const CitiesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCity, setEditingCity] = useState<{ original: string; new: string } | null>(null);

  const { data: cities, isLoading, refetch } = useQuery({
    queryKey: ['donation-cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('city')
        .not('city', 'is', null);

      if (error) throw error;

      // Count occurrences of each city
      const cityCount = data.reduce((acc: { [key: string]: number }, curr) => {
        acc[curr.city] = (acc[curr.city] || 0) + 1;
        return acc;
      }, {});

      // Convert to array of objects with count
      return Object.entries(cityCount).map(([city, count]) => ({
        name: city,
        count: count
      })).sort((a, b) => b.count - a.count);
    },
    meta: {
      errorMessage: "Erreur lors du chargement des villes"
    }
  });

  const handleUpdateCity = async (originalCity: string, newCity: string) => {
    try {
      const { error } = await supabase
        .from('donations')
        .update({ city: newCity })
        .eq('city', originalCity);

      if (error) throw error;

      toast.success("Ville mise à jour avec succès");
      setEditingCity(null);
      refetch();
    } catch (error) {
      console.error('Error updating city:', error);
      toast.error("Erreur lors de la mise à jour de la ville");
    }
  };

  const filteredCities = cities?.filter(city => 
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Villes</h1>
          <p className="text-gray-600 mt-2">
            Gérez et corrigez les noms des villes dans la base de données des donations
          </p>
        </div>
        <Settings className="w-8 h-8 text-gray-400" />
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <SearchInput
            placeholder="Rechercher une ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ville</TableHead>
                  <TableHead>Nombre de donations</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCities?.map((city) => (
                  <TableRow key={city.name}>
                    <TableCell>
                      {editingCity?.original === city.name ? (
                        <Input
                          value={editingCity.new}
                          onChange={(e) => setEditingCity({ 
                            ...editingCity, 
                            new: e.target.value 
                          })}
                          className="max-w-[200px]"
                        />
                      ) : (
                        city.name
                      )}
                    </TableCell>
                    <TableCell>{city.count}</TableCell>
                    <TableCell>
                      {editingCity?.original === city.name ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUpdateCity(city.name, editingCity.new)}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingCity({ 
                            original: city.name, 
                            new: city.name 
                          })}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CitiesManagement;