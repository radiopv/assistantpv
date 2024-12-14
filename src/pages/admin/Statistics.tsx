import { ChildrenNeedsTable } from "@/components/Dashboard/ChildrenNeeds/ChildrenNeedsTable";
import { useLanguage } from "@/contexts/LanguageContext";

const Statistics = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-8 p-4 md:p-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t("childrenNeeds")}</h1>
        <p className="text-sm md:text-base text-gray-600 mt-2">
          {t("editChildrenNeeds")}
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <ChildrenNeedsTable />
      </div>
    </div>
  );
};

export default Statistics;