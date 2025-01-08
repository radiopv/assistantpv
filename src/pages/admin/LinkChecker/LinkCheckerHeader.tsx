import { useLanguage } from "@/contexts/LanguageContext";

export const LinkCheckerHeader = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t("linkChecker")}</h1>
    </div>
  );
};