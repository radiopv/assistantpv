import { Need } from "@/types/needs";
import { NeedsSelectionField } from "../FormFields/NeedsSelectionField";
import { convertJsonToNeeds } from "@/types/needs";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "../FormFields/translations";

interface NeedsSectionProps {
  child: any;
  editing: boolean;
  onChange: (field: string, value: any) => void;
}

export const NeedsSection = ({ child, editing, onChange }: NeedsSectionProps) => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

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
        translations={t}
      />
    </div>
  );
};