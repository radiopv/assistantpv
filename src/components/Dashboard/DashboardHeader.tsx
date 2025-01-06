import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { DashboardStats } from "@/types/dashboard";

interface DashboardHeaderProps {
  stats: DashboardStats;
}

export const DashboardHeader = ({ stats }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="space-y-6 max-w-full overflow-hidden px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('dashboard')}</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            {t('welcomeMessage')}
          </p>
        </div>
      </div>
    </div>
  );
};