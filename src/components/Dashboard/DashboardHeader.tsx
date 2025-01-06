import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { DashboardStats } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

interface DashboardHeaderProps {
  stats: DashboardStats;
}

export const DashboardHeader = ({ stats }: DashboardHeaderProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleEditNeeds = (childId: string) => {
    navigate(`/children/${childId}/edit`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">
          {t('dashboard')}
        </h1>
        <p className="text-muted-foreground">
          {t('dashboardDescription')}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats?.urgent_needs?.length > 0 ? (
          stats.urgent_needs.map((need: any) => (
            <Card key={need.child_id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <h3 className="font-semibold">{need.child_name}</h3>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditNeeds(need.child_id)}
                >
                  Modifier
                </Button>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Besoins urgents :
                </p>
                <ul className="list-disc list-inside text-sm">
                  {need.needs.map((n: any, index: number) => (
                    <li key={index} className="text-red-600">
                      {n.category} {n.description && `- ${n.description}`}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">
              Aucun besoin urgent pour le moment
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};