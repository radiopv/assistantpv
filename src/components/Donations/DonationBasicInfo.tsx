import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CitySelector } from "./CitySelector/CitySelector";

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
  const [selectedAssistants, setSelectedAssistants] = useState<string[]>([]);

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
        <CitySelector
          city={city}
          onCityChange={onCityChange}
          cities={cities || []}
          refetchCities={refetchCities}
        />
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