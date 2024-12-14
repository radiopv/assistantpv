import { DetailedStats } from "@/components/Dashboard/DetailedStats";
import { AssistantStats } from "@/components/Dashboard/AdvancedStats/AssistantStats";
import { ChildrenNeedsTable } from "@/components/Dashboard/ChildrenNeedsTable";
import { useLanguage } from "@/contexts/LanguageContext";

const Statistics = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("statistics")}</h1>
        <p className="text-gray-600 mt-2">
          {t("statisticsOverview")}
        </p>
      </div>

      <DetailedStats />
      <AssistantStats />
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("childrenNeeds")}</h2>
        <ChildrenNeedsTable />
      </div>
    </div>
  );
};

export default Statistics;