import { useLanguage } from "@/contexts/LanguageContext";

const PlannedVisits = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('planned_visits')}</h1>
      {/* Planned visits content will be implemented later */}
    </div>
  );
};

export default PlannedVisits;