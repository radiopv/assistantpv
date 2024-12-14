import { DetailedStats } from "@/components/Dashboard/DetailedStats";
import { ChildrenNeedsTable } from "@/components/Dashboard/ChildrenNeeds/ChildrenNeedsTable";
import { useLanguage } from "@/contexts/LanguageContext";

const Statistics = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-8 p-4 md:p-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t("statistics")}</h1>
        <p className="text-sm md:text-base text-gray-600 mt-2">
          {t("statisticsOverview")}
        </p>
      </div>

      <DetailedStats />
      
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{t("childrenNeeds")}</h2>
        <div className="overflow-x-auto">
          <ChildrenNeedsTable />
        </div>
      </div>
    </div>
  );
};

export default Statistics;