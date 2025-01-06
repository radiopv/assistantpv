import { Card } from "@/components/ui/card";
import { NotificationBar } from "./NotificationBar";
import { useNavigate } from "react-router-dom";
import { 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger,
  Tooltip 
} from "@/components/ui/tooltip";
import { useLanguage } from "@/contexts/LanguageContext";
import { DashboardStats } from "@/types/dashboard";

interface DashboardHeaderProps {
  stats: DashboardStats;
}

export const DashboardHeader = ({ stats }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const dashboardStats = [
    {
      label: t('totalChildren'),
      value: stats?.children?.total || "0",
      color: "bg-primary",
      link: "/children",
      tooltip: t('viewAllChildren')
    },
    {
      label: t('sponsoredChildren'),
      value: stats?.children?.sponsored || "0",
      color: "bg-green-500",
      link: "/children?status=sponsored",
      tooltip: t('viewSponsoredChildren')
    },
    {
      label: t('urgentNeeds'),
      value: stats?.children?.urgent_needs || "0",
      color: "bg-red-500",
      link: "/children?status=urgent",
      tooltip: t('viewUrgentNeeds')
    },
    {
      label: t('activeCities'),
      value: stats?.cities || "0",
      color: "bg-blue-500",
      link: "/donations?view=cities",
      tooltip: t('viewCityStats')
    }
  ];

  return (
    <div className="space-y-6 max-w-full overflow-hidden px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('dashboard')}</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            {t('welcomeMessage')}
          </p>
        </div>
        <NotificationBar />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map(({ label, value, color, link, tooltip }) => (
          <TooltipProvider key={label}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card 
                  className="p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105 duration-200 w-full"
                  onClick={() => navigate(link)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`${color} p-2 sm:p-3 rounded-lg w-2 h-2 sm:w-3 sm:h-3`} />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">{label}</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
                    </div>
                  </div>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};