import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Need } from "@/types/needs";

interface NeedsBadgeProps {
  need: Need;
  isEditing: boolean;
  onUpdate: (updatedNeed: Need) => void;
}

export const NeedsBadge = ({ need, isEditing, onUpdate }: NeedsBadgeProps) => {
  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={need.category}
          onChange={(e) => onUpdate({ ...need, category: e.target.value })}
          className="w-24"
        />
        <Input
          value={need.description}
          onChange={(e) => onUpdate({ ...need, description: e.target.value })}
          className="w-32"
        />
        <Button
          variant={need.is_urgent ? "destructive" : "secondary"}
          onClick={() => onUpdate({ ...need, is_urgent: !need.is_urgent })}
          size="sm"
        >
          {need.is_urgent ? "Urgent" : "Normal"}
        </Button>
      </div>
    );
  }

  return (
    <Badge variant={need.is_urgent ? "destructive" : "secondary"}>
      {need.category}: {need.description}
    </Badge>
  );
};