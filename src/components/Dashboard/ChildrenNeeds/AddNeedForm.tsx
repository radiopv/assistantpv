import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Need } from "@/types/needs";
import { NeedCategoryIcon } from "./NeedCategoryIcon";
import { Badge } from "@/components/ui/badge";
import { BellRing } from "lucide-react";

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

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sélectionner la catégorie</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {NEED_CATEGORIES.map((category) => (
            <Button
              key={category.value}
              variant={newNeed.category === category.value ? "default" : "outline"}
              className="flex items-center gap-2 w-full"
              onClick={() => setNewNeed({ ...newNeed, category: category.value })}
            >
              <NeedCategoryIcon category={category.value} />
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Description du besoin</h3>
          <Button
            variant={newNeed.is_urgent ? "destructive" : "outline"}
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setNewNeed({ ...newNeed, is_urgent: !newNeed.is_urgent })}
          >
            <BellRing className="w-4 h-4" />
            {newNeed.is_urgent ? "Urgent" : "Non urgent"}
          </Button>
        </div>
        <Input
          placeholder="Description détaillée du besoin..."
          value={newNeed.description}
          onChange={(e) => setNewNeed({ ...newNeed, description: e.target.value })}
          className="w-full"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Enfants concernés</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {children.map((child) => (
            <Button
              key={child.id}
              variant={selectedChildren.some(c => c.id === child.id) ? "default" : "outline"}
              className="flex items-center gap-2"
              onClick={() => {
                if (selectedChildren.some(c => c.id === child.id)) {
                  setSelectedChildren(selectedChildren.filter(c => c.id !== child.id));
                } else {
                  setSelectedChildren([...selectedChildren, child]);
                }
              }}
            >
              {child.name}
            </Button>
          ))}
        </div>
      </div>

      <Button 
        onClick={onSubmit} 
        disabled={selectedChildren.length === 0 || !newNeed.category || !newNeed.description}
        className="w-full"
      >
        Ajouter le besoin pour {selectedChildren.length} enfant{selectedChildren.length > 1 ? 's' : ''}
      </Button>
    </Card>
  );
};