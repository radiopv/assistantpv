import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Need } from "@/types/needs";
import { BellRing, Plus } from "lucide-react";

interface NeedFormProps {
  selectedNeeds: Need[];
  setSelectedNeeds: (needs: Need[]) => void;
  onSubmit: () => void;
}

const NEED_CATEGORIES = [
  { value: "education", label: "Éducation" },
  { value: "jouet", label: "Jouet" },
  { value: "vetement", label: "Vêtement" },
  { value: "nourriture", "Nourriture" },
  { value: "medicament", label: "Médicament" },
  { value: "hygiene", label: "Hygiène" },
  { value: "autre", label: "Autre" }
];

export const NeedForm = ({ selectedNeeds, setSelectedNeeds, onSubmit }: NeedFormProps) => {
  const addNeed = () => {
    setSelectedNeeds([...selectedNeeds, { category: "", description: "", is_urgent: false }]);
  };

  const removeNeed = (index: number) => {
    setSelectedNeeds(selectedNeeds.filter((_, i) => i !== index));
  };

  const updateNeed = (index: number, field: keyof Need, value: any) => {
    const updatedNeeds = [...selectedNeeds];
    updatedNeeds[index] = { ...updatedNeeds[index], [field]: value };
    setSelectedNeeds(updatedNeeds);
  };

  return (
    <Card className="p-4 space-y-4 bg-white shadow-lg">
      <div className="space-y-4">
        {selectedNeeds.map((need, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg relative animate-fade-in">
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              onClick={() => removeNeed(index)}
            >
              ×
            </Button>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {NEED_CATEGORIES.map((category) => (
                <Button
                  key={category.value}
                  variant={need.category === category.value ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                  onClick={() => updateNeed(index, "category", category.value)}
                >
                  {category.label}
                </Button>
              ))}
            </div>

            <Textarea
              placeholder="Description détaillée du besoin..."
              value={need.description}
              onChange={(e) => updateNeed(index, "description", e.target.value)}
              className="min-h-[100px] resize-y"
            />

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`urgent-${index}`}
                checked={need.is_urgent}
                onCheckedChange={(checked) => updateNeed(index, "is_urgent", checked)}
              />
              <label htmlFor={`urgent-${index}`} className="flex items-center text-sm cursor-pointer">
                <BellRing className="w-4 h-4 mr-1 text-red-500" />
                Besoin urgent
              </label>
            </div>
          </div>
        ))}

        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={addNeed}
        >
          <Plus className="w-4 h-4" />
          Ajouter un besoin
        </Button>

        <Button 
          className="w-full"
          disabled={selectedNeeds.length === 0 || selectedNeeds.some(n => !n.category || !n.description)}
          onClick={onSubmit}
        >
          Enregistrer les besoins
        </Button>
      </div>
    </Card>
  );
};