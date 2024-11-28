import { Card } from "@/components/ui/card";
import { Users, Gift, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "@/components/ErrorAlert";

interface DashboardStats {
  children: {
    total: number;
    sponsored: number;
    available: number;
    urgent_needs: number;
  };
  sponsors: number;
  donations: {
    total: number;
    people_helped: number;
  };
  cities: number;
}

const Dashboard = () => {
  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_dashboard_statistics');
      if (error) throw error;
      return data as DashboardStats;
    }
  });

  if (error) {
    return (
      <div className="space-y-6">
        <ErrorAlert 
          message="Une erreur est survenue lors du chargement des statistiques" 
          retry={() => refetch()}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16 mt-1" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const dashboardStats = [
    {
      label: "Enfants",
      value: stats?.children?.total || "0",
      icon: Users,
      color: "bg-primary",
    },
    {
      label: "Dons",
      value: stats?.donations?.total || "0",
      icon: Gift,
      color: "bg-secondary",
    },
    {
      label: "Besoins Urgents",
      value: stats?.children?.urgent_needs || "0",
      icon: AlertTriangle,
      color: "bg-accent",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-2">
          Bienvenue dans votre espace assistant TousPourCuba
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {dashboardStats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-6">
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
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Activités Récentes</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="bg-primary/10 p-2 rounded-full">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Nouvel enfant ajouté</p>
              <p className="text-sm text-gray-600">Il y a 2 heures</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="bg-secondary/10 p-2 rounded-full">
              <Gift className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="font-medium">Nouveau don enregistré</p>
              <p className="text-sm text-gray-600">Il y a 5 heures</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;