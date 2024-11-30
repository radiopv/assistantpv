import { Card } from "@/components/ui/card";
import { Need } from "@/types/needs";
import { NeedCategoryIcon } from "./NeedCategoryIcon";
import { Badge } from "@/components/ui/badge";
import { BellRing } from "lucide-react";

interface NeedsListProps {
  child: any;
  needs: Need[];
}

export const NeedsList = ({ child, needs }: NeedsListProps) => {
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
    <Card key={child.id} className="p-4 space-y-4">
      <h3 className="font-semibold text-lg">{child.name}</h3>
      <div className="space-y-3">
        {needs?.map((need: Need, index: number) => (
          <div 
            key={`${need.category}-${index}`}
            className={`p-4 rounded-lg border transition-all ${
              need.is_urgent 
                ? 'bg-red-50 border-red-200 hover:bg-red-100' 
                : 'bg-green-50 border-green-200 hover:bg-green-100'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <NeedCategoryIcon category={need.category as string} />
                  <span className="font-medium">
                    {NEED_CATEGORIES[need.category as keyof typeof NEED_CATEGORIES]}
                  </span>
                </div>
                {need.is_urgent && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <BellRing className="w-3 h-3" />
                    Urgent
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">{need.description}</p>
            </div>
          </div>
        ))}
        {needs.length === 0 && (
          <p className="text-sm text-gray-500 italic">Aucun besoin enregistré</p>
        )}
      </div>
    </Card>
  );
};