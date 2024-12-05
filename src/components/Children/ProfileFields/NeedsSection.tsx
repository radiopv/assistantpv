import { Need } from "@/types/needs";
import { NeedsSelectionField } from "../FormFields/NeedsSelectionField";
import { convertJsonToNeeds } from "@/types/needs";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "../FormFields/translations";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface NeedsSectionProps {
  child: any;
  editing: boolean;
  onChange: (field: string, value: any) => void;
}

const NEED_CATEGORIES = {
  education: "Éducation",
  jouet: "Juguetes",
  vetement: "Ropa",
  nourriture: "Alimentación",
  medicament: "Medicamentos",
  hygiene: "Higiene",
  autre: "Otros"
};

export const NeedsSection = ({ child, editing, onChange }: NeedsSectionProps) => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

  const handleNeedsChange = (needs: Need[]) => {
    console.log("Saving needs directly:", needs);
    onChange('needs', needs);
  };

  const getButtonStyle = (isUrgent: boolean) => {
    if (isUrgent) {
      return "w-full bg-blue-600 text-white hover:bg-blue-700";
    }
    return "w-full bg-gray-100 text-gray-900 hover:bg-gray-200";
  };

  const renderNeeds = () => {
    const needs = convertJsonToNeeds(child.needs);
    return (
      <ScrollArea className="h-auto max-h-[400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2">
          {needs.map((need, index) => (
            <div key={`${need.category}-${index}`} className="space-y-2">
              <Button
                variant="outline"
                className={`${getButtonStyle(need.is_urgent)} justify-start px-4 py-2 h-auto`}
              >
                {NEED_CATEGORIES[need.category as keyof typeof NEED_CATEGORIES]}
              </Button>
              {need.is_urgent && (
                <div className="flex items-center space-x-2 px-2">
                  <Checkbox id={`urgent-${index}`} checked={true} disabled />
                  <label htmlFor={`urgent-${index}`} className="text-sm text-gray-600">
                    Besoin urgent pour : {NEED_CATEGORIES[need.category as keyof typeof NEED_CATEGORIES]}
                  </label>
                </div>
              )}
              {need.description && (
                <div className="px-2">
                  <p className="text-sm text-gray-600">{need.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className="grid gap-4">
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