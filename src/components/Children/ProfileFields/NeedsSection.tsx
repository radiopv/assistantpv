import { Need } from "@/types/needs";
import { NeedsSelectionField } from "../FormFields/NeedsSelectionField";
import { convertJsonToNeeds, convertNeedsToJson } from "@/types/needs";

interface NeedsSectionProps {
  child: any;
  editing: boolean;
  onChange: (field: string, value: string) => void;
}

export const NeedsSection = ({ child, editing, onChange }: NeedsSectionProps) => {
  const handleNeedsChange = (needs: Need[]) => {
    const jsonNeeds = convertNeedsToJson(needs);
    console.log("Saving needs to database:", jsonNeeds);
    onChange('needs', JSON.stringify(jsonNeeds));
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