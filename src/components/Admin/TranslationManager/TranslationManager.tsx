import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Languages } from "lucide-react";
import { frenchTranslations } from "@/translations/fr";
import { spanishTranslations } from "@/translations/es";
import { useLanguage } from "@/contexts/LanguageContext";
import { TranslationScanner } from "./TranslationScanner";

type TranslationType = {
  [key: string]: string;
};

export const TranslationManager = () => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState<{
    fr: TranslationType;
    es: TranslationType;
  }>({
    fr: { ...frenchTranslations },
    es: { ...spanishTranslations }
  });
  const [scanning, setScanning] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const handleTranslationChange = (lang: 'fr' | 'es', key: string, value: string) => {
    setTranslations(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    try {
      // Here you would typically save to a backend
      // For now, we'll just show the current state
      console.log('Current translations:', translations);
      
      // Check for duplicate keys
      const frKeys = Object.keys(translations.fr);
      const esKeys = Object.keys(translations.es);
      const hasDuplicates = frKeys.length !== new Set(frKeys).size || 
                           esKeys.length !== new Set(esKeys).size;
      
      if (hasDuplicates) {
        toast.error(t("translationError"));
        console.error('Duplicate keys found in translations');
        return;
      }
      
      toast.success(t("translationUpdated"));
    } catch (error) {
      toast.error(t("translationError"));
      console.error('Error saving translations:', error);
    }
  };

  const handleScan = async () => {
    setScanning(true);
    setShowScanner(true);
    try {
      toast.success(t("scanStarted"));
    } catch (error) {
      toast.error(t("scanError"));
      console.error('Error scanning translations:', error);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t("translationManager")}</h2>
          <Button 
            onClick={handleScan}
            disabled={scanning}
            variant="outline"
          >
            <Languages className="w-4 h-4 mr-2" />
            {scanning ? t("scanningTranslations") : t("scanAssistantSection")}
          </Button>
        </div>
        
        <Tabs defaultValue="fr" className="w-full">
          <TabsList>
            <TabsTrigger value="fr">{t("frenchTranslations")}</TabsTrigger>
            <TabsTrigger value="es">{t("spanishTranslations")}</TabsTrigger>
          </TabsList>

          <TabsContent value="fr">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {Object.entries(translations.fr).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 gap-4">
                    <Input 
                      value={key} 
                      disabled 
                      className="bg-gray-50"
                    />
                    <Input
                      value={value}
                      onChange={(e) => handleTranslationChange('fr', key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="es">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {Object.entries(translations.es).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 gap-4">
                    <Input 
                      value={key} 
                      disabled 
                      className="bg-gray-50"
                    />
                    <Input
                      value={value}
                      onChange={(e) => handleTranslationChange('es', key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button onClick={handleSave}>{t("save")}</Button>
        </div>
      </Card>

      {showScanner && <TranslationScanner />}
    </div>
  );
};