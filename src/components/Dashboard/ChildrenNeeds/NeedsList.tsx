import { Card } from "@/components/ui/card";
import { Need } from "@/types/needs";
import { BellRing } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NeedsListProps {
  child: any;
  needs: Need[];
}

const NEED_CATEGORIES = {
  education: "Éducation",
  jouet: "Jouet",
  vetement: "Vêtement",
  nourriture: "Nourriture",
  medicament: "Médicament",
  hygiene: "Hygiène",
  autre: "Autre"
};

export const NeedsList = ({ child, needs }: NeedsListProps) => {
  if (!needs || needs.length === 0) return null;

  return (
    <Card className="overflow-hidden bg-white shadow-lg">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-semibold text-lg">{child.name}</h3>
        <p className="text-sm text-gray-600">{child.age} ans</p>
      </div>
      
      <div className="p-4 space-y-4">
        {needs.map((need, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg border transition-all ${
              need.is_urgent 
                ? 'bg-red-50 border-red-200 animate-pulse' 
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant={need.is_urgent ? "destructive" : "secondary"}>
                  {NEED_CATEGORIES[need.category as keyof typeof NEED_CATEGORIES]}
                </Badge>
                {need.is_urgent && (
                  <div className="flex items-center text-red-500 text-sm">
                    <BellRing className="w-4 h-4 mr-1" />
                    Urgent
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {need.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};