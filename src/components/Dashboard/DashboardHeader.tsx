import { Card } from "@/components/ui/card";
import { NotificationBar } from "./NotificationBar";
import { useNavigate } from "react-router-dom";
import { 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger,
  Tooltip 
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface DashboardHeaderProps {
  stats: DashboardStats;
}

export const DashboardHeader = ({ stats }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { data: incompleteProfiles } = useQuery({
    queryKey: ['incomplete-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .or('gender.is.null,birth_date.is.null,name.is.null,photo_url.is.null,city.is.null,story.is.null,comments.is.null,description.is.null');
      
      if (error) throw error;
      
      return data?.filter(child => {
        return !child.gender ||
               !child.birth_date ||
               !child.name ||
               !child.photo_url ||
               !child.city ||
               !child.story ||
               !child.comments ||
               !child.description;
      });
    }
  });

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
    },
    {
      label: t('incompleteProfiles'),
      value: incompleteProfiles?.length || "0",
      color: "bg-yellow-500",
      link: "/children?status=incomplete",
      tooltip: t('viewIncompleteProfiles')
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard')}</h1>
          <p className="text-gray-600 mt-2">
            {t('welcomeMessage')}
          </p>
        </div>
        <NotificationBar />
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
        {dashboardStats.map(({ label, value, color, link, tooltip }) => (
          <TooltipProvider key={label}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card 
                  className="p-6 hover:shadow-md transition-all cursor-pointer transform hover:scale-105 duration-200"
                  onClick={() => navigate(link)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`${color} p-3 rounded-lg w-3 h-3`} />
                    <div>
                      <p className="text-sm text-gray-600">{label}</p>
                      <p className="text-2xl font-bold">{value}</p>
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