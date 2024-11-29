import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CityItem } from "./CityItem";

interface CitySelectorProps {
  city: string;
  onCityChange: (value: string) => void;
  cities: string[];
  refetchCities: () => void;
}

export const CitySelector = ({
  city,
  onCityChange,
  cities,
  refetchCities,
}: CitySelectorProps) => {
  const [showNewCityInput, setShowNewCityInput] = useState(false);
  const [newCity, setNewCity] = useState("");
  const [editingCity, setEditingCity] = useState<string | null>(null);
  const [editedCityName, setEditedCityName] = useState("");
  const { toast } = useToast();

  const handleAddNewCity = async () => {
    if (!newCity.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom de la ville ne peut pas être vide",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('locations')
        .insert({ 
          city_name: newCity.trim(),
          latitude: 0,
          longitude: 0
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Nouvelle ville ajoutée avec succès",
      });

      onCityChange(newCity.trim());
      setNewCity("");
      setShowNewCityInput(false);
      refetchCities();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de l'ajout de la ville",
      });
      console.error('Error adding city:', error);
    }
  };

  const handleEditCity = async (oldCityName: string) => {
    if (!editedCityName.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom de la ville ne peut pas être vide",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('locations')
        .update({ city_name: editedCityName.trim() })
        .eq('city_name', oldCityName);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Ville modifiée avec succès",
      });

      if (city === oldCityName) {
        onCityChange(editedCityName.trim());
      }
      setEditingCity(null);
      setEditedCityName("");
      refetchCities();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la modification de la ville",
      });
      console.error('Error editing city:', error);
    }
  };

  const handleDeleteCity = async (cityName: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la ville "${cityName}" ?`)) {
      try {
        const { error } = await supabase
          .from('locations')
          .delete()
          .eq('city_name', cityName);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Ville supprimée avec succès",
        });

        if (city === cityName) {
          onCityChange("");
        }
        refetchCities();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Erreur lors de la suppression de la ville",
        });
        console.error('Error deleting city:', error);
      }
    }
  };

  return (
    <div className="space-y-2">
      {showNewCityInput ? (
        <div className="flex gap-2">
          <Input
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            placeholder="Nouvelle ville"
          />
          <Button onClick={handleAddNewCity} variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
          <Button onClick={() => setShowNewCityInput(false)} variant="outline" size="icon">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <Select value={city} onValueChange={onCityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une ville" />
            </SelectTrigger>
            <SelectContent>
              {cities?.map((cityName) => (
                <SelectItem key={cityName} value={cityName}>
                  <CityItem
                    cityName={cityName}
                    isEditing={editingCity === cityName}
                    editedName={editedCityName}
                    onEdit={() => {
                      setEditingCity(cityName);
                      setEditedCityName(cityName);
                    }}
                    onDelete={() => handleDeleteCity(cityName)}
                    onSave={() => handleEditCity(cityName)}
                    onCancel={() => {
                      setEditingCity(null);
                      setEditedCityName("");
                    }}
                    onEditedNameChange={setEditedCityName}
                  />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowNewCityInput(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une nouvelle ville
          </Button>
        </>
      )}
    </div>
  );
};