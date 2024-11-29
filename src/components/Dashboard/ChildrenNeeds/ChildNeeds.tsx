import { Card } from "@/components/ui/card";
import { Need } from "@/types/needs";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChildNeedsProps {
  child: any;
  needs: Need[];
  onDeleteNeed?: (index: number) => void;
}

export const ChildNeeds = ({ child, needs, onDeleteNeed }: ChildNeedsProps) => {
  const NEED_CATEGORIES = {
    education: "Éducation",
    jouet: "Jouet",
    vetement: "Vêtement",
    nourriture: "Nourriture",
    medicament: "Médicament",
    hygiene: "Hygiène",
    autre: "Autre"
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold text-lg mb-4">{child.name}</h3>
      <div className="space-y-4">
        {needs?.map((need: Need, index: number) => (
          <div 
            key={`${need.category}-${index}`}
            className={`p-3 rounded-lg border ${
              need.is_urgent ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant={need.is_urgent ? "destructive" : "default"}>
                    {NEED_CATEGORIES[need.category as keyof typeof NEED_CATEGORIES]}
                  </Badge>
                  {need.is_urgent && (
                    <Badge variant="outline" className="text-red-500 border-red-500">
                      Urgent
                    </Badge>
                  )}
                </div>
                {onDeleteNeed && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700"
                    onClick={() => onDeleteNeed(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="text-sm text-gray-600">{need.description}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};