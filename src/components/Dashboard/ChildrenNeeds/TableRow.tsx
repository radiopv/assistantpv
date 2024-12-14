import { TableCell, TableRow as UITableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Save, Edit } from "lucide-react";
import { NeedsCell } from "./NeedsCell";
import { EditableCell } from "./EditableCell";
import { ChildNeed } from "./types";

interface TableRowProps {
  child: ChildNeed;
  isEditing: boolean;
  onEdit: (child: ChildNeed) => void;
  onSave: (childId: string) => void;
  editableFields: ChildNeed | null;
  setEditableFields: React.Dispatch<React.SetStateAction<ChildNeed | null>>;
}

export const TableRow = ({
  child,
  isEditing,
  onEdit,
  onSave,
  editableFields,
  setEditableFields,
}: TableRowProps) => {
  const handleFieldUpdate = (field: keyof ChildNeed, value: any) => {
    setEditableFields(prev => prev ? { ...prev, [field]: value } : null);
  };

  return (
    <UITableRow key={child.childId}>
      <TableCell>{child.childName}</TableCell>
      <TableCell>
        <NeedsCell
          needs={isEditing ? editableFields?.needs || [] : child.needs}
          isEditing={isEditing}
          onUpdate={(updatedNeeds) => handleFieldUpdate('needs', updatedNeeds)}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          value={isEditing ? editableFields?.description || "" : child.description}
          isEditing={isEditing}
          onChange={(value) => handleFieldUpdate('description', value)}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          value={isEditing ? editableFields?.story || "" : child.story}
          isEditing={isEditing}
          onChange={(value) => handleFieldUpdate('story', value)}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          value={isEditing ? editableFields?.comments || "" : child.comments}
          isEditing={isEditing}
          onChange={(value) => handleFieldUpdate('comments', value)}
        />
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Button
            variant="default"
            onClick={() => onSave(child.childId)}
            className="h-8 w-8 p-0"
          >
            <Save className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={() => onEdit(child)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </TableCell>
    </UITableRow>
  );
};