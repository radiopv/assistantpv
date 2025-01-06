import { DetailedStats } from "@/components/Dashboard/DetailedStats";
import { AssistantStats } from "@/components/Dashboard/AdvancedStats/AssistantStats";

const Statistics = () => {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
        <p className="text-gray-600 mt-2">
          Vue d'ensemble des statistiques de la plateforme
        </p>
      </div>

      <DetailedStats />
      <AssistantStats />
    </div>
  );
};

export default Statistics;