import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { frenchTranslations } from "@/translations/fr";
import { spanishTranslations } from "@/translations/es";
import { useLanguage } from "@/contexts/LanguageContext";

export const TranslationManager = () => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    fr: { ...frenchTranslations },
    es: { ...spanishTranslations }
  });

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

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">{t("translationManager")}</h2>
      
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
  );
};