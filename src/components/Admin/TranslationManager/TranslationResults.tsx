import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface TranslationResultsProps {
  missingTranslations: Array<{ key: string; language: string }>;
  unusedTranslations: string[];
  englishTexts: Array<{ text: string; location: string }>;
}

export const TranslationResults = ({ 
  missingTranslations, 
  unusedTranslations, 
  englishTexts 
}: TranslationResultsProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {missingTranslations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">{t("missingTranslations")}</h3>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {missingTranslations.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm">{item.key}</span>
                  <Badge variant="outline">
                    {item.language === 'fr' ? 'French' : 'Spanish'}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {unusedTranslations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">{t("unusedTranslations")}</h3>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {unusedTranslations.map((key, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded font-mono text-sm">
                  {key}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {englishTexts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">{t("englishTextDetected")}</h3>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {englishTexts.map((item, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded">
                  <p className="font-mono text-sm">{item.text}</p>
                  <p className="text-xs text-gray-500 mt-1">Location: {item.location}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};