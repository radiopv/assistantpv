import { Textarea } from "@/components/ui/textarea";

interface EditableCellProps {
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}

export const EditableCell = ({ value, isEditing, onChange }: EditableCellProps) => {
  if (isEditing) {
    return (
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[100px]"
      />
    );
  }

  return <div className="max-w-md overflow-auto">{value}</div>;
};