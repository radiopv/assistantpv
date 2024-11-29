import { AlertTriangle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Need } from "@/types/needs";

interface NeedCardProps {
  need: Need;
  onDelete: () => void;
}

export const NeedCard = ({ need, onDelete }: NeedCardProps) => {
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
    <div className={`p-3 rounded-lg border ${
      need.is_urgent ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
    }`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {need.categories.map((category) => (
              <Badge key={category} variant={need.is_urgent ? "destructive" : "default"}>
                {NEED_CATEGORIES[category as keyof typeof NEED_CATEGORIES]}
              </Badge>
            ))}
            {need.is_urgent && (
              <div className="flex items-center gap-1 text-red-500">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Urgent</span>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-700"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-gray-600">{need.description}</div>
      </div>
    </div>
  );
};