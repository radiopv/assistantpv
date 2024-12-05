import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface TranslationApprovalProps {
  translations: {
    key: string;
    text: string;
    language: string;
  }[];
  onApprove: (key: string, value: string, language: string) => void;
}

export const TranslationApproval = ({ translations, onApprove }: TranslationApprovalProps) => {
  const { t, addTranslation } = useLanguage();
  const [editedTranslations, setEditedTranslations] = useState<Record<string, string>>({});

  const handleTranslationChange = (key: string, value: string) => {
    setEditedTranslations(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApprove = (key: string, language: string) => {
    const translationValue = editedTranslations[key];
    if (!translationValue?.trim()) {
      toast.error(t("translationRequired"));
      return;
    }
    onApprove(key, translationValue, language);
    toast.success(t("translationApproved"));

    // Ajouter la traduction au contexte
    addTranslation(key, translationValue, language as 'fr' | 'es');
  };

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {translations.map(({ key, text, language }) => (
          <div key={key} className="p-4 bg-gray-50 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">{key}</span>
              <Badge variant="outline">
                {language === 'fr' ? 'French' : 'Spanish'}
              </Badge>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              {t("originalText")}: {text}
            </div>
            <div className="flex gap-2">
              <Input
                value={editedTranslations[key] || ''}
                onChange={(e) => handleTranslationChange(key, e.target.value)}
                placeholder={t("enterTranslation")}
                className="flex-1"
              />
              <Button 
                onClick={() => handleApprove(key, language)}
                size="sm"
              >
                {t("approve")}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
