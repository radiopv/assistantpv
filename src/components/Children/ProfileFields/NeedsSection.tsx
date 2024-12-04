import { Need } from "@/types/needs";
import { NeedsSelectionField } from "../FormFields/NeedsSelectionField";
import { convertJsonToNeeds } from "@/types/needs";

interface NeedsSectionProps {
  child: any;
  editing: boolean;
  onChange: (field: string, value: any) => void;
}

export const NeedsSection = ({ child, editing, onChange }: NeedsSectionProps) => {
  const handleNeedsChange = (needs: Need[]) => {
    console.log("Saving needs directly:", needs);
    onChange('needs', needs);
  };

  if (!editing) return null;

  return (
    <div className="grid gap-2">
      <NeedsSelectionField
        selectedNeeds={convertJsonToNeeds(child.needs)}
        onNeedsChange={handleNeedsChange}
      />
    </div>
  );
};