import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Need } from "@/types/needs";
import { Card } from "@/components/ui/card";

interface AddNeedFormProps {
  selectedChild: any;
  newNeed: Need;
  setNewNeed: (need: Need) => void;
  onSubmit: () => void;
}

export const AddNeedForm = ({ selectedChild, newNeed, setNewNeed, onSubmit }: AddNeedFormProps) => {
  const NEED_CATEGORIES = [
    { value: "education", label: "Éducation" },
    { value: "jouet", label: "Jouet" },
    { value: "vetement", label: "Vêtement" },
    { value: "nourriture", label: "Nourriture" },
    { value: "medicament", label: "Médicament" },
    { value: "hygiene", label: "Hygiène" },
    { value: "autre", label: "Autre" }
  ];

  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-lg font-semibold">Ajouter un besoin pour {selectedChild?.name}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {NEED_CATEGORIES.map((category) => (
          <div key={category.value} className="flex items-center space-x-2">
            <Checkbox
              id={category.value}
              checked={newNeed.category === category.value}
              onCheckedChange={(checked) => {
                if (checked) {
                  setNewNeed({ ...newNeed, category: category.value });
                }
              }}
            />
            <label htmlFor={category.value} className="text-sm text-gray-600">
              {category.label}
            </label>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Description du besoin"
          value={newNeed.description}
          onChange={(e) => setNewNeed({ ...newNeed, description: e.target.value })}
          className="w-full"
        />

        <div className="flex items-center space-x-2">
          <Checkbox
            id="urgent"
            checked={newNeed.is_urgent}
            onCheckedChange={(checked) => setNewNeed({ ...newNeed, is_urgent: checked as boolean })}
          />
          <label htmlFor="urgent" className="text-sm text-gray-600">Besoin urgent</label>
        </div>

        <Button 
          onClick={onSubmit} 
          disabled={!selectedChild || !newNeed.category || !newNeed.description}
          className="w-full"
        >
          Ajouter le besoin
        </Button>
      </div>
    </Card>
  );
};