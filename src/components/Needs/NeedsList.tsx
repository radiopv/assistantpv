import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Need } from "@/types/needs";

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
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{childName}</h3>
      <div className="space-y-2">
        {needs?.map((need, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div>
              <p className="font-medium">{need.category}</p>
              <p className="text-sm text-gray-600">{need.description}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={need.is_urgent ? "destructive" : "outline"}
                size="sm"
                onClick={() => onToggleUrgent(childId, index)}
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteNeed(childId, index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {(!needs || needs.length === 0) && (
          <p className="text-gray-500 text-center py-2">Aucun besoin enregistré</p>
        )}
      </div>
    </Card>
  );
};