import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Trash2, X, Check } from "lucide-react";

interface CityItemProps {
  cityName: string;
  isEditing: boolean;
  editedName: string;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
  onEditedNameChange: (value: string) => void;
}

export const CityItem = ({
  cityName,
  isEditing,
  editedName,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onEditedNameChange,
}: CityItemProps) => {
  if (isEditing) {
    return (
      <div className="flex items-center justify-between w-full">
        <Input
          value={editedName}
          onChange={(e) => onEditedNameChange(e.target.value)}
          placeholder="Modifier la ville"
          className="h-6 flex-1"
        />
        <div className="flex gap-2 ml-2">
          <Button onClick={onSave} variant="ghost" size="sm">
            <Check className="h-4 w-4" />
          </Button>
          <Button onClick={onCancel} variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full">
      <span>{cityName}</span>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};