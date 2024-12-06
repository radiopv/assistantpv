import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TextFieldsProps {
  child: any;
  editing: boolean;
  onChange: (field: string, value: string) => void;
}

export const TextFields = ({ child, editing, onChange }: TextFieldsProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.id, e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={child.description || ""}
          onChange={handleInputChange}
          disabled={!editing}
          placeholder="Description générale de l'enfant..."
          className="min-h-[100px] w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="story">Histoire</Label>
        <Textarea
          id="story"
          value={child.story || ""}
          onChange={handleInputChange}
          disabled={!editing}
          placeholder="Histoire de l'enfant..."
          className="min-h-[150px] w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments">Commentaires</Label>
        <Textarea
          id="comments"
          value={child.comments || ""}
          onChange={handleInputChange}
          disabled={!editing}
          placeholder="Commentaires additionnels..."
          className="min-h-[100px] w-full"
        />
      </div>
    </div>
  );
};