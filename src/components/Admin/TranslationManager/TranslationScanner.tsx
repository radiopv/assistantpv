import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle2, Languages } from "lucide-react";
import { frenchTranslations } from "@/translations/fr";
import { spanishTranslations } from "@/translations/es";
import { useLanguage } from "@/contexts/LanguageContext";
import { TranslationResults } from "./TranslationResults";
import { TranslationApproval } from "./TranslationApproval";

interface MissingTranslation {
  key: string;
  language: string;
}

interface EnglishText {
  text: string;
  location: string;
}

export const TranslationScanner = () => {
  const { t } = useLanguage();
  const [missingTranslations, setMissingTranslations] = useState<MissingTranslation[]>([]);
  const [unusedTranslations, setUnusedTranslations] = useState<string[]>([]);
  const [englishTexts, setEnglishTexts] = useState<EnglishText[]>([]);
  const [scanning, setScanning] = useState(false);
  const [pendingTranslations, setPendingTranslations] = useState<Array<{
    key: string;
    text: string;
    language: string;
  }>>([]);

  const detectEnglishText = () => {
    setScanning(true);
    console.log("Scanning for English text...");
    
    // Regex pattern for English text detection
    // Excludes common programming terms and short words
    const englishPattern = /[a-zA-Z\s]{4,}/g;
    const foundTexts: EnglishText[] = [];
    const programTerms = new Set([
      'function', 'const', 'let', 'var', 'return', 'import', 'export',
      'class', 'interface', 'type', 'extends', 'implements'
    ]);

    const scanNode = (node: Node, location: string) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (text && englishPattern.test(text)) {
          // Check if text is not already a translation key
          if (!Object.keys(frenchTranslations).includes(text) && 
              !Object.keys(spanishTranslations).includes(text) &&
              !programTerms.has(text.toLowerCase())) {
            console.log(`Found potential English text: "${text}" at ${location}`);
            
            // Add visual indicator
            const parent = node.parentElement;
            if (parent && !parent.querySelector('.translation-pending')) {
              const indicator = document.createElement('span');
              indicator.className = 'translation-pending ml-1';
              indicator.textContent = '🔄';
              indicator.title = 'Translation pending';
              parent.appendChild(indicator);
            }

            foundTexts.push({ text, location });
            setPendingTranslations(prev => [
              ...prev,
              { key: text, text, language: 'fr' },
              { key: text, text, language: 'es' }
            ]);
          }
        }
      }
      node.childNodes.forEach(child => scanNode(child, location));
    };

    scanNode(document.body, 'body');
    setEnglishTexts(foundTexts);
    console.log("Found", foundTexts.length, "English texts");
    setScanning(false);
  };

  const scanForMissingTranslations = () => {
    setScanning(true);
    console.log("Scanning for missing translations...");
    const missing: MissingTranslation[] = [];
    
    // Check French translations in Spanish
    Object.keys(frenchTranslations).forEach(key => {
      if (!spanishTranslations[key]) {
        missing.push({ key, language: 'es' });
        console.log(`Missing Spanish translation for key: ${key}`);
      }
    });

    // Check Spanish translations in French
    Object.keys(spanishTranslations).forEach(key => {
      if (!frenchTranslations[key]) {
        missing.push({ key, language: 'fr' });
        console.log(`Missing French translation for key: ${key}`);
      }
    });

    setMissingTranslations(missing);
    console.log("Scan complete. Found", missing.length, "missing translations");
    setScanning(false);
  };

  const findUnusedTranslations = async () => {
    setScanning(true);
    console.log("Scanning for unused translations...");
    const allKeys = new Set([
      ...Object.keys(frenchTranslations),
      ...Object.keys(spanishTranslations)
    ]);

    const unused = Array.from(allKeys).filter(key => {
      const keyUsageCount = document.body.innerHTML.split(key).length - 1;
      if (keyUsageCount === 0) {
        console.log(`Found unused translation key: ${key}`);
      }
      return keyUsageCount === 0;
    });

    setUnusedTranslations(unused);
    console.log("Found", unused.length, "unused translations");
    setScanning(false);
  };

  const handleTranslationApprove = (key: string, value: string, language: string) => {
    console.log('Approved translation:', { key, value, language });
    
    // Remove the visual indicator after approval
    document.querySelectorAll('.translation-pending').forEach(el => {
      if (el.previousSibling?.textContent?.includes(key)) {
        el.remove();
      }
    });

    setPendingTranslations(prev => prev.filter(t => t.key !== key));
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
            <Button
              onClick={detectEnglishText}
              disabled={scanning}
              variant="outline"
            >
              <Languages className="w-4 h-4 mr-2" />
              {t("detectEnglishText")}
            </Button>
          </div>
        </div>

        {missingTranslations.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <p className="ml-2">
              {t("missingTranslationsFound").replace("{{count}}", missingTranslations.length.toString())}
            </p>
          </Alert>
        )}

        {unusedTranslations.length > 0 && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <p className="ml-2">
              {t("unusedTranslationsFound").replace("{{count}}", unusedTranslations.length.toString())}
            </p>
          </Alert>
        )}

        {englishTexts.length > 0 && (
          <Alert>
            <Languages className="h-4 w-4" />
            <p className="ml-2">
              {t("englishTextFound").replace("{{count}}", englishTexts.length.toString())}
            </p>
          </Alert>
        )}

        {pendingTranslations.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">{t("pendingTranslations")}</h3>
            <TranslationApproval 
              translations={pendingTranslations}
              onApprove={handleTranslationApprove}
            />
          </div>
        )}

        <TranslationResults
          missingTranslations={missingTranslations}
          unusedTranslations={unusedTranslations}
          englishTexts={englishTexts}
        />
      </div>
    </Card>
  );
};
