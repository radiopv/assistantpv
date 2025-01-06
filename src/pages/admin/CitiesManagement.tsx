import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Settings, Edit, Save, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { SearchInput } from "@/components/ui/search-input";
import { useLanguage } from "@/contexts/LanguageContext";

const CitiesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCity, setEditingCity] = useState<{ original: string; new: string } | null>(null);
  const { t } = useLanguage();

  const { data: cities, isLoading, refetch } = useQuery({
    queryKey: ['donation-cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('city')
        .not('city', 'is', null);

      if (error) throw error;

      const cityCount = data.reduce((acc: { [key: string]: number }, curr) => {
        acc[curr.city] = (acc[curr.city] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(cityCount).map(([city, count]) => ({
        name: city,
        count: count
      })).sort((a, b) => b.count - a.count);
    },
    meta: {
      errorMessage: t("errorUpdatingCity")
    }
  });

  const findSimilarCity = useCallback((cityName: string) => {
    if (!cities) return null;
    
    const normalizedName = cityName.toLowerCase().trim();
    return cities.find(city => {
      const existingName = city.name.toLowerCase().trim();
      if (existingName === normalizedName) return false;
      
      return existingName.includes(normalizedName) || 
             normalizedName.includes(existingName) ||
             (existingName.length > 3 && normalizedName.length > 3 && 
              (existingName.slice(0, 4) === normalizedName.slice(0, 4)));
    });
  }, [cities]);

  const handleUpdateCity = async (originalCity: string, newCity: string) => {
    try {
      const similarCity = findSimilarCity(newCity);
      if (similarCity) {
        const confirm = window.confirm(
          `${t("similarCityWarning")}: ${similarCity.name}. ${t("continueQuestion")}`
        );
        if (!confirm) return;
      }

      const { error } = await supabase
        .from('donations')
        .update({ city: newCity.trim() })
        .eq('city', originalCity);

      if (error) throw error;

      toast.success(t("cityUpdated"));
      setEditingCity(null);
      refetch();
    } catch (error) {
      console.error('Error updating city:', error);
      toast.error(t("errorUpdatingCity"));
    }
  };

  const filteredCities = cities?.filter(city => 
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t("citiesManagement")}</h1>
          <p className="text-gray-600 mt-2">
            {t("citiesManagementDescription")}
          </p>
        </div>
        <Settings className="w-8 h-8 text-gray-400" />
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <SearchInput
            placeholder={t("searchCity")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("cityName")}</TableHead>
                  <TableHead>{t("donationsCount")}</TableHead>
                  <TableHead className="w-[100px]">{t("tableActions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCities?.map((city) => (
                  <TableRow key={city.name}>
                    <TableCell>
                      {editingCity?.original === city.name ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editingCity.new}
                            onChange={(e) => setEditingCity({ 
                              ...editingCity, 
                              new: e.target.value 
                            })}
                            className="max-w-[200px]"
                          />
                          {findSimilarCity(editingCity.new) && (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
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