import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Need } from "@/types/needs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface NeedsListProps {
  childId: string;
  childName: string;
  needs: Need[];
  onToggleUrgent: (childId: string, needIndex: number) => Promise<void>;
  onDeleteNeed: (childId: string, needIndex: number) => Promise<void>;
}

export const NeedsList = ({ 
  childId, 
  childName, 
  needs = [], 
  onToggleUrgent, 
  onDeleteNeed 
}: NeedsListProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      education: "Éducation",
      jouet: "Jouet",
      vetement: "Vêtement",
      nourriture: "Nourriture",
      medicament: "Médicament",
      hygiene: "Hygiène",
      autre: "Autre"
    };
    return labels[category] || category;
  };

  return (
    <Card className="p-4 md:p-6">
      <h3 className="text-lg font-semibold mb-4">{childName}</h3>
      <div className="space-y-4">
        {needs.map((need, index) => {
          return (
            <div 
              key={`${need.categories?.join('-')}-${index}`}
              className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  {need.categories?.map(category => (
                    <Badge key={category} className="bg-red-500 text-white">
                      {getCategoryLabel(category)}
                    </Badge>
                  ))}
                  <Input
                    value={need.description}
                    onChange={(e) => {
                      // Update description functionality can be added here
                    }}
                    placeholder="Ajouter un commentaire..."
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`urgent-${need.categories?.join('-')}`}
                    checked={need.is_urgent}
                    onCheckedChange={() => onToggleUrgent(childId, index)}
                  />
                  <label 
                    htmlFor={`urgent-${need.categories?.join('-')}`}
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    Marquer comme urgent
                  </label>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                onClick={() => onDeleteNeed(childId, index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
