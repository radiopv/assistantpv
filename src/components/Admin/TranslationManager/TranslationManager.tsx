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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type TranslationType = {
  [key: string]: string;
};

type HomepageSection = {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  content: any;
};

export const TranslationManager = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [translations, setTranslations] = useState<{
    fr: TranslationType;
    es: TranslationType;
  }>({
    fr: { ...frenchTranslations },
    es: { ...spanishTranslations }
  });
  const [scanning, setScanning] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  // Fetch homepage sections
  const { data: homepageSections } = useQuery({
    queryKey: ['homepage-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_sections')
        .select('*');
      if (error) throw error;
      return data as HomepageSection[];
    }
  });

  // Update homepage section
  const updateSection = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<HomepageSection> }) => {
      const { error } = await supabase
        .from('homepage_sections')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-sections'] });
      toast.success(t("contentUpdated"));
    },
    onError: (error) => {
      toast.error(t("updateError"));
      console.error('Error updating section:', error);
    }
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

  const handleSectionUpdate = (id: string, field: string, value: string) => {
    updateSection.mutate({
      id,
      updates: { [field]: value }
    });
  };

  const handleSave = () => {
    try {
      console.log('Current translations:', translations);
      
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
          <h2 className="text-2xl font-bold">{t("contentManager")}</h2>
          <Button 
            onClick={handleScan}
            disabled={scanning}
            variant="outline"
          >
            <Languages className="w-4 h-4 mr-2" />
            {scanning ? t("scanningTranslations") : t("scanAssistantSection")}
          </Button>
        </div>
        
        <Tabs defaultValue="homepage" className="w-full">
          <TabsList>
            <TabsTrigger value="homepage">{t("homepageContent")}</TabsTrigger>
            <TabsTrigger value="fr">{t("frenchTranslations")}</TabsTrigger>
            <TabsTrigger value="es">{t("spanishTranslations")}</TabsTrigger>
          </TabsList>

          <TabsContent value="homepage">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                {homepageSections?.map((section) => (
                  <div key={section.id} className="space-y-4">
                    <h3 className="text-lg font-semibold capitalize">
                      {section.section_key.replace(/_/g, ' ')}
                    </h3>
                    <div className="grid gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          {t("title")}
                        </label>
                        <Input
                          value={section.title || ''}
                          onChange={(e) => handleSectionUpdate(section.id, 'title', e.target.value)}
                          placeholder={t("enterTitle")}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          {t("subtitle")}
                        </label>
                        <Input
                          value={section.subtitle || ''}
                          onChange={(e) => handleSectionUpdate(section.id, 'subtitle', e.target.value)}
                          placeholder={t("enterSubtitle")}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

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