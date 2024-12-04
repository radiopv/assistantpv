import { Card } from "@/components/ui/card";
import { Users, Gift, AlertTriangle, MapPin, User } from "lucide-react";
import { DashboardStats } from "@/types/dashboard";
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

interface DashboardHeaderProps {
  stats: DashboardStats;
}

export const DashboardHeader = ({ stats }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  const { data: incompleteProfiles } = useQuery({
    queryKey: ['incomplete-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .or('gender.is.null,birth_date.is.null,name.is.null,photo_url.is.null,city.is.null,story.is.null,comments.is.null,description.is.null');
      
      if (error) throw error;
      
      // Filter profiles that have at least one required field missing
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
      label: "Enfants Total",
      value: stats?.children?.total || "0",
      icon: Users,
      color: "bg-primary",
      link: "/children",
      tooltip: "Voir tous les enfants"
    },
    {
      label: "Enfants Parrainés",
      value: stats?.children?.sponsored || "0",
      icon: Gift,
      color: "bg-green-500",
      link: "/children?status=sponsored",
      tooltip: "Voir les enfants parrainés"
    },
    {
      label: "Besoins Urgents",
      value: stats?.children?.urgent_needs || "0",
      icon: AlertTriangle,
      color: "bg-red-500",
      link: "/children?status=urgent",
      tooltip: "Voir les besoins urgents"
    },
    {
      label: "Villes Actives",
      value: stats?.cities || "0",
      icon: MapPin,
      color: "bg-blue-500",
      link: "/donations?view=cities",
      tooltip: "Voir les statistiques par ville"
    },
    {
      label: "Profils Incomplets",
      value: incompleteProfiles?.length || "0",
      icon: User,
      color: "bg-yellow-500",
      link: "/children?status=incomplete",
      tooltip: "Voir les profils incomplets"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-2">
            Bienvenue dans votre espace assistant TousPourCuba
          </p>
        </div>
        <NotificationBar />
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
        {dashboardStats.map(({ label, value, icon: Icon, color, link, tooltip }) => (
          <TooltipProvider key={label}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card 
                  className="p-6 hover:shadow-md transition-all cursor-pointer transform hover:scale-105 duration-200"
                  onClick={() => navigate(link)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`${color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
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