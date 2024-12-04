import { Card } from "@/components/ui/card";
import { Need } from "@/types/needs";
import { Badge } from "@/components/ui/badge";
import { convertJsonToNeeds } from "@/types/needs";

interface ChildNeedsProps {
  child: any;
  needs: Need[];
}

export const ChildNeeds = ({ child, needs: rawNeeds }: ChildNeedsProps) => {
  const NEED_CATEGORIES = {
    education: "Éducation",
    jouet: "Jouet",
    vetement: "Vêtement",
    nourriture: "Nourriture",
    medicament: "Médicament",
    hygiene: "Hygiène",
    autre: "Autre"
  };

  // Ensure needs is always an array using the conversion function
  const needs = Array.isArray(rawNeeds) ? rawNeeds : convertJsonToNeeds(rawNeeds);

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
              <div className="text-sm text-gray-600">{need.description}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};