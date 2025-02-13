import { Card } from "@/components/ui/card";
import { Need } from "@/types/needs";

interface ChildNeedsProps {
  child: any;
  needs: Need[];
}

export const ChildNeeds = ({ child, needs }: ChildNeedsProps) => {
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
    <div className="space-y-4">
      {Array.isArray(needs) && needs.map((need: Need, index: number) => (
        <div 
          key={`${need.category}-${index}`}
          className="p-3 rounded-lg border bg-gray-50"
        >
          <div className="flex items-start gap-2">
            {need.is_urgent && (
              <span className="text-red-600 font-medium whitespace-nowrap">URGENT:</span>
            )}
            <div>
              <span className="font-medium">
                {NEED_CATEGORIES[need.category as keyof typeof NEED_CATEGORIES]}
              </span>
              {need.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {need.description}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
      {(!Array.isArray(needs) || needs.length === 0) && (
        <p className="text-sm text-gray-500">Aucun besoin enregistré</p>
      )}
    </div>
  );
};