import { Card } from "@/components/ui/card";
import { Need } from "@/types/needs";
import { NeedCategoryIcon } from "./NeedCategoryIcon";

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
          className={`p-4 rounded-lg border ${need.is_urgent ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}
        >
          <div className="flex items-start gap-3">
            <div className={`mt-1 ${need.is_urgent ? 'text-red-500' : 'text-gray-500'}`}>
              <NeedCategoryIcon category={need.category} />
            </div>
            <div className="flex-1">
              {need.is_urgent && (
                <span className="inline-block px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full mb-2">
                  URGENT
                </span>
              )}
              <div className="font-medium text-gray-900">
                {NEED_CATEGORIES[need.category as keyof typeof NEED_CATEGORIES]}
              </div>
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