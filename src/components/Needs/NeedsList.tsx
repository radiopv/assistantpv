import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Need } from "@/types/needs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
  needs, 
  onToggleUrgent, 
  onDeleteNeed 
}: NeedsListProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const allCategories = [
    'education',
    'jouet',
    'vetement',
    'nourriture',
    'medicament',
    'hygiene',
    'autre'
  ];

  const handleCategoryClick = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const getCategoryColor = (category: string, isActive: boolean = false) => {
    const colors: Record<string, string> = {
      education: isActive ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600',
      jouet: isActive ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600',
      vetement: isActive ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600',
      nourriture: isActive ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600',
      medicament: isActive ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600',
      hygiene: isActive ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600',
      autre: isActive ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'
    };
    return colors[category] || colors.autre;
  };

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
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{childName}</h3>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {allCategories.map((category) => (
            <Badge 
              key={category}
              className={`cursor-pointer transition-colors duration-200 ${getCategoryColor(category, selectedCategories.includes(category))}`}
              onClick={() => handleCategoryClick(category)}
            >
              {getCategoryLabel(category)}
            </Badge>
          ))}
        </div>
        <div className="space-y-3">
          {selectedCategories.map((category, index) => (
            <div 
              key={`${category}-${index}`}
              className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge 
                    className={`${getCategoryColor(category, true)}`}
                  >
                    {getCategoryLabel(category)}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`urgent-${index}`}
                    checked={needs.some(need => need.category === category && need.is_urgent)}
                    onCheckedChange={() => {
                      const needIndex = needs.findIndex(need => need.category === category);
                      if (needIndex !== -1) {
                        onToggleUrgent(childId, needIndex);
                      }
                    }}
                  />
                  <label 
                    htmlFor={`urgent-${index}`}
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
                onClick={() => {
                  const needIndex = needs.findIndex(need => need.category === category);
                  if (needIndex !== -1) {
                    onDeleteNeed(childId, needIndex);
                  }
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {(!selectedCategories || selectedCategories.length === 0) && (
            <p className="text-gray-500 text-center py-2">Aucun besoin enregistré</p>
          )}
        </div>
      </div>
    </Card>
  );
};