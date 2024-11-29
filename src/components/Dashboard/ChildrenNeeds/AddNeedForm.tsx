import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Need } from "@/types/needs";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface AddNeedFormProps {
  children: any[];
  selectedChildren: any[];
  newNeed: Need;
  setSelectedChildren: (children: any[]) => void;
  setNewNeed: (need: Need) => void;
  onSubmit: () => void;
}

export const AddNeedForm = ({ 
  children, 
  selectedChildren,
  newNeed, 
  setSelectedChildren,
  setNewNeed, 
  onSubmit 
}: AddNeedFormProps) => {
  const NEED_CATEGORIES = [
    { value: "education", label: "Éducation" },
    { value: "jouet", label: "Jouet" },
    { value: "vetement", label: "Vêtement" },
    { value: "nourriture", label: "Nourriture" },
    { value: "medicament", label: "Médicament" },
    { value: "hygiene", label: "Hygiène" },
    { value: "autre", label: "Autre" }
  ];

  const sortedChildren = [...children].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sélectionner les enfants</h3>
        <ScrollArea className="h-[200px] border rounded-md p-4">
          <div className="space-y-2">
            {sortedChildren.map((child) => (
              <div key={child.id} className="flex items-center space-x-2">
                <Checkbox
                  id={child.id}
                  checked={selectedChildren.some(c => c.id === child.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedChildren([...selectedChildren, child]);
                    } else {
                      setSelectedChildren(selectedChildren.filter(c => c.id !== child.id));
                    }
                  }}
                />
                <label htmlFor={child.id} className="text-sm">
                  {child.name}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Détails des besoins</h3>
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
          disabled={selectedChildren.length === 0 || !newNeed.categories?.length || !newNeed.description}
          className="w-full"
        >
          Ajouter le besoin pour {selectedChildren.length} enfant{selectedChildren.length > 1 ? 's' : ''}
        </Button>
      </div>
    </Card>
  );
};