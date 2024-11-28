import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Need } from "@/types/needs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

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
  const allCategories = [
    'education',
    'jouet',
    'vetement',
    'nourriture',
    'medicament',
    'hygiene',
    'autre'
  ];

  const getCategoryColor = (category: string, isActive: boolean = false) => {
    const colors: Record<string, string> = {
      education: `${isActive ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800'} hover:bg-blue-200`,
      jouet: `${isActive ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-800'} hover:bg-purple-200`,
      vetement: `${isActive ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-800'} hover:bg-pink-200`,
      nourriture: `${isActive ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800'} hover:bg-green-200`,
      medicament: `${isActive ? 'bg-red-500 text-white' : 'bg-red-100 text-red-800'} hover:bg-red-200`,
      hygiene: `${isActive ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-800'} hover:bg-yellow-200`,
      autre: `${isActive ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-800'} hover:bg-gray-200`
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

  const isCategoryActive = (category: string) => {
    return needs?.some(need => need.category === category);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{childName}</h3>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {allCategories.map((category) => (
            <Badge 
              key={category}
              className={`cursor-pointer ${getCategoryColor(category, isCategoryActive(category))}`}
            >
              {getCategoryLabel(category)}
            </Badge>
          ))}
        </div>
        <div className="space-y-3">
          {needs?.map((need, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge 
                    className={`${getCategoryColor(need.category, true)}`}
                  >
                    {getCategoryLabel(need.category)}
                  </Badge>
                  {need.is_urgent && (
                    <Badge variant="destructive" className="animate-pulse">
                      Urgent
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{need.description}</p>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`urgent-${index}`}
                    checked={need.is_urgent}
                    onCheckedChange={() => onToggleUrgent(childId, index)}
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
                onClick={() => onDeleteNeed(childId, index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {(!needs || needs.length === 0) && (
            <p className="text-gray-500 text-center py-2">Aucun besoin enregistré</p>
          )}
        </div>
      </div>
    </Card>
  );
};