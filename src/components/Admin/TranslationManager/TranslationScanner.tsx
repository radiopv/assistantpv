import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { frenchTranslations } from "@/translations/fr";
import { spanishTranslations } from "@/translations/es";
import { useLanguage } from "@/contexts/LanguageContext";

interface MissingTranslation {
  key: string;
  language: string;
}

export const TranslationScanner = () => {
  const { t } = useLanguage();
  const [missingTranslations, setMissingTranslations] = useState<MissingTranslation[]>([]);
  const [unusedTranslations, setUnusedTranslations] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);

  const scanForMissingTranslations = () => {
    setScanning(true);
    const missing: MissingTranslation[] = [];
    
    // Compare French and Spanish translations
    Object.keys(frenchTranslations).forEach(key => {
      if (!spanishTranslations[key]) {
        missing.push({ key, language: 'es' });
      }
    });

    Object.keys(spanishTranslations).forEach(key => {
      if (!frenchTranslations[key]) {
        missing.push({ key, language: 'fr' });
      }
    });

    setMissingTranslations(missing);
    setScanning(false);
  };

  const findUnusedTranslations = async () => {
    setScanning(true);
    const allKeys = new Set([
      ...Object.keys(frenchTranslations),
      ...Object.keys(spanishTranslations)
    ]);

    // This is a basic check that could be enhanced with more sophisticated scanning
    const unused = Array.from(allKeys).filter(key => {
      const keyUsageCount = document.body.innerHTML.split(key).length - 1;
      return keyUsageCount === 0;
    });

    setUnusedTranslations(unused);
    setScanning(false);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{t("translationScanner")}</h2>
          <div className="space-x-2">
            <Button 
              onClick={scanForMissingTranslations}
              disabled={scanning}
            >
              {t("scanMissingTranslations")}
            </Button>
            <Button 
              onClick={findUnusedTranslations}
              disabled={scanning}
              variant="outline"
            >
              {t("findUnusedTranslations")}
            </Button>
          </div>
        </div>

        {missingTranslations.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {t(`missingTranslationsFound_${missingTranslations.length}`)}
            </AlertDescription>
          </Alert>
        )}

        {unusedTranslations.length > 0 && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              {t(`unusedTranslationsFound_${unusedTranslations.length}`)}
            </AlertDescription>
          </Alert>
        )}

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
        </div>
      </div>
    </Card>
  );
};