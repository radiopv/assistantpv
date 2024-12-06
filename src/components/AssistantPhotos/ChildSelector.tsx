import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChildSelectorProps {
  children: { id: string; name: string }[];
  selectedChild: string | null;
  onSelect: (childId: string) => void;
}

export const ChildSelector = ({ children, selectedChild, onSelect }: ChildSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Sélectionner un enfant</label>
      <Select value={selectedChild || undefined} onValueChange={onSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Choisir un enfant" />
        </SelectTrigger>
        <SelectContent>
          {children.map((child) => (
            <SelectItem key={child.id} value={child.id}>
              {child.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};