import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Need } from "@/types/needs";
import { useLanguage } from "@/contexts/LanguageContext";

interface NeedCheckboxesProps {
  needs: Need[];
  onNeedsChange: (needs: Need[]) => void;
}

const NEED_CATEGORIES = {
  education: {
    fr: "Éducation",
    es: "Educación",
  },
  jouet: {
    fr: "Jouet",
    es: "Juguetes",
  },
  vetement: {
    fr: "Vêtement",
    es: "Ropa",
  },
  nourriture: {
    fr: "Nourriture",
    es: "Alimentación",
  },
  medicament: {
    fr: "Médicament",
    es: "Medicamentos",
  },
  hygiene: {
    fr: "Hygiène",
    es: "Higiene",
  },
  autre: {
    fr: "Autre",
    es: "Otro",
  }
};

export const NeedCheckboxes = ({ needs, onNeedsChange }: NeedCheckboxesProps) => {
  const { language } = useLanguage();
  
  const handleNeedToggle = (category: string, checked: boolean) => {
    if (checked) {
      onNeedsChange([...needs, { category, description: '', is_urgent: false }]);
    } else {
      onNeedsChange(needs.filter(need => need.category !== category));
    }
  };

  const handleUrgentToggle = (category: string, checked: boolean) => {
    onNeedsChange(
      needs.map(need => 
        need.category === category 
          ? { ...need, is_urgent: checked }
          : need
      )
    );
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50">
      {Object.entries(NEED_CATEGORIES).map(([category, labels]) => {
        const existingNeed = needs.find(n => n.category === category);
        
        return (
          <div key={category} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`need-${category}`}
                checked={!!existingNeed}
                onCheckedChange={(checked) => handleNeedToggle(category, checked as boolean)}
              />
              <Label htmlFor={`need-${category}`}>
                {labels[language as keyof typeof labels]}
              </Label>
            </div>
            
            {existingNeed && (
              <div className="flex items-center space-x-2 ml-6">
                <Checkbox
                  id={`urgent-${category}`}
                  checked={existingNeed.is_urgent}
                  onCheckedChange={(checked) => handleUrgentToggle(category, checked as boolean)}
                />
                <Label htmlFor={`urgent-${category}`} className="text-red-600">
                  Urgent
                </Label>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};