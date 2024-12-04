import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { LanguageSelector } from "@/components/LanguageSelector";

const Settings = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">{t('settings')}</h1>
      
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">{t('language')}</h2>
        <LanguageSelector />
      </Card>
    </div>
  );
};

export default Settings;