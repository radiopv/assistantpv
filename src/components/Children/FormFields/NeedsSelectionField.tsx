import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Need } from "@/types/needs";
import { Label } from "@/components/ui/label";

interface NeedsSelectionFieldProps {
  selectedNeeds: Need[];
  onNeedsChange: (needs: Need[]) => void;
  translations: any;
}

export const NeedsSelectionField = ({ selectedNeeds, onNeedsChange, translations }: NeedsSelectionFieldProps) => {
  const [availableNeeds, setAvailableNeeds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        const { data, error } = await supabase
          .from('aid_categories')
          .select('name');

        if (error) throw error;

        setAvailableNeeds(data?.map(n => n.name) || [
          "education",
          "jouet",
          "vetement",
          "nourriture",
          "medicament",
          "hygiene",
          "autre"
        ]);
      } catch (error) {
        console.error('Error fetching needs:', error);
        setAvailableNeeds([
          "education",
          "jouet",
          "vetement",
          "nourriture",
          "medicament",
          "hygiene",
          "autre"
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNeeds();
  }, []);

  const toggleNeed = (category: string) => {
    const existingNeed = selectedNeeds.find(n => n.category === category);
    if (existingNeed) {
      onNeedsChange(selectedNeeds.filter(n => n.category !== category));
    } else {
      onNeedsChange([...selectedNeeds, { category, description: '', is_urgent: false }]);
    }
  };

  const updateNeedDescription = (category: string, description: string) => {
    onNeedsChange(
      selectedNeeds.map(need => 
        need.category === category 
          ? { ...need, description } 
          : need
      )
    );
  };

  const toggleUrgent = (category: string) => {
    onNeedsChange(
      selectedNeeds.map(need => 
        need.category === category 
          ? { ...need, is_urgent: !need.is_urgent } 
          : need
      )
    );
  };

  if (loading) {
    return <div>Chargement des besoins...</div>;
  }

  return (
    <div className="space-y-4">
      <Label>{translations.childNeeds}</Label>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {availableNeeds.map((category) => (
          <Button
            key={category}
            type="button"
            variant={selectedNeeds.some(n => n.category === category) ? "default" : "outline"}
            onClick={() => toggleNeed(category)}
            className="w-full"
          >
            {category}
          </Button>
        ))}
      </div>

      {selectedNeeds.length > 0 && (
        <div className="space-y-4 mt-4">
          {selectedNeeds.map((need) => (
            <div key={need.category} className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`urgent-${need.category}`}
                  checked={need.is_urgent}
                  onCheckedChange={() => toggleUrgent(need.category)}
                />
                <Label htmlFor={`urgent-${need.category}`}>
                  {translations.urgentNeed} {need.category}
                </Label>
              </div>
              
              <Input
                placeholder={translations.needDescription}
                value={need.description}
                onChange={(e) => updateNeedDescription(need.category, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};