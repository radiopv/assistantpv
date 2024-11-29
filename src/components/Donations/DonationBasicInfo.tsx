import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const assistants = [
  { id: "vitia", name: "Vitia" },
  { id: "oveslay", name: "Oveslay" },
  { id: "daimelys", name: "Daimelys" }
];

interface DonationBasicInfoProps {
  city: string;
  onCityChange: (value: string) => void;
  quantity: string;
  onQuantityChange: (value: string) => void;
  assistantName: string;
  onAssistantNameChange: (value: string) => void;
}

export const DonationBasicInfo = ({
  city,
  onCityChange,
  quantity,
  onQuantityChange,
  assistantName,
  onAssistantNameChange,
}: DonationBasicInfoProps) => {
  const [newCity, setNewCity] = useState("");
  const [showNewCityInput, setShowNewCityInput] = useState(false);
  const { toast } = useToast();

  const { data: cities, refetch: refetchCities } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('city_name')
        .order('city_name');
      
      if (error) throw error;
      return data.map(location => location.city_name);
    }
  });

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

  const [selectedAssistants, setSelectedAssistants] = useState<string[]>([]);

  const handleAssistantChange = (assistantId: string, checked: boolean) => {
    setSelectedAssistants(prev => {
      const newSelection = checked 
        ? [...prev, assistantId]
        : prev.filter(id => id !== assistantId);
      
      onAssistantNameChange(newSelection.map(id => 
        assistants.find(a => a.id === id)?.name || ''
      ).join(', '));
      
      return newSelection;
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div>
        <Label>Assistants</Label>
        <div className="space-y-2 mt-2">
          {assistants.map((assistant) => (
            <div key={assistant.id} className="flex items-center space-x-2">
              <Checkbox
                id={assistant.id}
                checked={selectedAssistants.includes(assistant.id)}
                onCheckedChange={(checked) => 
                  handleAssistantChange(assistant.id, checked as boolean)
                }
              />
              <Label htmlFor={assistant.id} className="cursor-pointer">
                {assistant.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="city">Ville</Label>
        {showNewCityInput ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="Nouvelle ville"
              />
              <Button 
                onClick={handleAddNewCity}
                variant="outline"
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button 
                onClick={() => setShowNewCityInput(false)}
                variant="outline"
                size="icon"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Select value={city} onValueChange={onCityChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une ville" />
              </SelectTrigger>
              <SelectContent>
                {cities?.map((cityName) => (
                  <SelectItem key={cityName} value={cityName}>
                    {cityName}
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
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="quantity">Nombre de personnes aidées</Label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => onQuantityChange(e.target.value)}
          min="1"
        />
      </div>
    </div>
  );
};