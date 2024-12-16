import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";

export const TranslationManager = () => {
  const { t } = useLanguage();
  const { translations } = useTranslation();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t("translationManager")}</h1>
      <Card className="p-4">
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(translations, null, 2)}
        </pre>
      </Card>
    </div>
  );
};