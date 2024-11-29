import { Need } from "@/types/needs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

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
    <div className="space-y-4 bg-white p-4 rounded-lg border shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {NEED_CATEGORIES.map((category) => (
          <div key={category.value} className="flex items-center space-x-2">
            <Checkbox
              id={category.value}
              checked={newNeed.categories?.includes(category.value)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setNewNeed({ 
                    ...newNeed, 
                    categories: [...(newNeed.categories || []), category.value] 
                  });
                } else {
                  setNewNeed({
                    ...newNeed,
                    categories: newNeed.categories?.filter(c => c !== category.value) || []
                  });
                }
              }}
            />
            <label htmlFor={category.value} className="text-sm text-gray-600">
              {category.label}
            </label>
          </div>
        ))}
      </div>

      <Input
        placeholder="Description du besoin"
        value={newNeed.description}
        onChange={(e) => setNewNeed({ ...newNeed, description: e.target.value })}
        className="bg-white"
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
        disabled={!selectedChild || !newNeed.categories?.length || !newNeed.description}
        className="w-full"
      >
        Ajouter
      </Button>
    </div>
  );
};