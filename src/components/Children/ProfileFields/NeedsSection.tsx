import { Need } from "@/types/needs";
import { NeedsSelectionField } from "../FormFields/NeedsSelectionField";
import { convertJsonToNeeds } from "@/types/needs";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "../FormFields/translations";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NeedsSectionProps {
  child: any;
  editing: boolean;
  onChange: (field: string, value: any) => void;
}

const NEED_CATEGORIES = {
  education: "Éducation",
  jouet: "Jouets",
  vetement: "Vêtements",
  nourriture: "Nourriture",
  medicament: "Médicaments",
  hygiene: "Hygiène",
  autre: "Autre"
};

export const NeedsSection = ({ child, editing, onChange }: NeedsSectionProps) => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

  const handleNeedsChange = (needs: Need[]) => {
    console.log("Saving needs directly:", needs);
    onChange('needs', needs);
  };

  const getBadgeStyle = (isUrgent: boolean) => {
    if (isUrgent) {
      return "bg-red-100 hover:bg-red-200 text-red-800 border-red-200";
    }
    return "bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200";
  };

  const renderNeeds = () => {
    const needs = convertJsonToNeeds(child.needs);
    return (
      <ScrollArea className="h-auto max-h-[200px]">
        <div className="flex flex-wrap gap-2 p-2">
          {needs.map((need, index) => (
            <Badge
              key={`${need.category}-${index}`}
              variant="outline"
              className={`px-3 py-1.5 text-sm font-medium ${getBadgeStyle(need.is_urgent)}`}
            >
              {NEED_CATEGORIES[need.category as keyof typeof NEED_CATEGORIES]}
              {need.is_urgent && (
                <span className="ml-2 text-red-600">•</span>
              )}
            </Badge>
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className="grid gap-2">
      {!editing && renderNeeds()}
      {editing && (
        <>
          {renderNeeds()}
          <div className="mt-4">
            <NeedsSelectionField
              selectedNeeds={convertJsonToNeeds(child.needs)}
              onNeedsChange={handleNeedsChange}
              translations={t}
            />
          </div>
        </>
      )}
    </div>
  );
};