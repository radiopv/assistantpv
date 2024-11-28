import { Card } from "@/components/ui/card";
import { Users, Gift, AlertTriangle, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "@/components/ErrorAlert";
import { SponsorshipList } from "@/components/Sponsorship/SponsorshipList";
import { SponsorshipStats } from "@/components/Sponsorship/SponsorshipStats";
import { toast } from "sonner";

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

interface CityStats {
  city: string;
  donations: number;
  people_helped: number;
}

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_dashboard_statistics');
      if (error) {
        console.error('Error fetching dashboard stats:', error);
        throw new Error(error.message);
      }
      // Add type assertion to handle the conversion
      return data as unknown as DashboardStats;
    },
    retry: 1,
    meta: {
      errorMessage: "Erreur lors du chargement des statistiques"
    },
    onError: (error) => {
      console.error('Query error:', error);
      toast.error("Erreur lors du chargement des statistiques");
    }
  });

  const { data: cityStats, isLoading: cityStatsLoading, error: cityStatsError } = useQuery({
    queryKey: ['city-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_city_donation_stats');
      if (error) {
        console.error('Error fetching city stats:', error);
        throw new Error(error.message);
      }
      return data as CityStats[];
    },
    retry: 1,
    meta: {
      errorMessage: "Erreur lors du chargement des statistiques par ville"
    },
    onError: (error) => {
      console.error('Query error:', error);
      toast.error("Erreur lors du chargement des statistiques par ville");
    }
  });

  if (statsError || cityStatsError) {
    return (
      <div className="space-y-6">
        <ErrorAlert 
          message="Une erreur est survenue lors du chargement des statistiques" 
          retry={() => {
            refetchStats();
          }}
        />
      </div>
    );
  }

  const isLoading = statsLoading || cityStatsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
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
      label: "Enfants Total",
      value: stats?.children?.total || "0",
      icon: Users,
      color: "bg-primary",
    },
    {
      label: "Enfants Parrainés",
      value: stats?.children?.sponsored || "0",
      icon: Gift,
      color: "bg-green-500",
    },
    {
      label: "Besoins Urgents",
      value: stats?.children?.urgent_needs || "0",
      icon: AlertTriangle,
      color: "bg-red-500",
    },
    {
      label: "Villes Actives",
      value: stats?.cities || "0",
      icon: MapPin,
      color: "bg-blue-500",
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

      <div className="grid gap-6 md:grid-cols-4">
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

      {cityStats && cityStats.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Statistiques par Ville</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cityStats.map((cityStat) => (
              <Card key={cityStat.city} className="p-4">
                <h3 className="font-semibold text-lg">{cityStat.city}</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    Donations: <span className="font-medium">{cityStat.donations}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Personnes aidées: <span className="font-medium">{cityStat.people_helped}</span>
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Gestion des Parrainages</h2>
        <SponsorshipStats />
        <SponsorshipList />
      </div>
    </div>
  );
};

export default Dashboard;