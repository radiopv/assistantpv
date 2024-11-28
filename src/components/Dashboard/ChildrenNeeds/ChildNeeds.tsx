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
    <Card key={child.id} className="p-4">
      <h3 className="font-semibold text-lg mb-4">{child.name}</h3>
      <div className="space-y-4">
        {needs?.map((need: Need, index: number) => (
          <div 
            key={index}
            className={`p-3 rounded-lg border ${
              need.is_urgent ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
            }`}
          >
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {need.categories?.map(category => (
                  <span key={category} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {NEED_CATEGORIES[category as keyof typeof NEED_CATEGORIES]}
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-600">{need.description}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};