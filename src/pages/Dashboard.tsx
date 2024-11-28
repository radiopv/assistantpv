import { Card } from "@/components/ui/card";
import { Users, Gift, AlertTriangle, MapPin, TrendingUp, Calendar } from "lucide-react";
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

interface DonationTrend {
  month: string;
  donations: number;
  people_helped: number;
  success_rate: number;
}

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_dashboard_statistics');
      if (error) throw error;
      return data as DashboardStats;
    }
  });

  const { data: recentDonations, isLoading: donationsLoading } = useQuery({
    queryKey: ['recent-donations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('donation_date', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    }
  });

  const { data: trends, isLoading: trendsLoading } = useQuery({
    queryKey: ['donation-trends'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_monthly_donation_trends', { months_back: 6 });
      if (error) throw error;
      return data as DonationTrend[];
    }
  });

  const { data: cityStats, isLoading: cityStatsLoading } = useQuery({
    queryKey: ['city-donation-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_city_donation_stats');
      if (error) throw error;
      return data;
    }
  });

  if (statsError) {
    return (
      <div className="space-y-6">
        <ErrorAlert 
          message="Une erreur est survenue lors du chargement des statistiques" 
          retry={() => refetchStats()}
        />
      </div>
    );
  }

  const isLoading = statsLoading || donationsLoading || trendsLoading || cityStatsLoading;

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

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Derniers Dons</h2>
            <TrendingUp className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentDonations?.map((donation) => (
              <div key={donation.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Gift className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{donation.assistant_name}</p>
                  <p className="text-sm text-gray-600">
                    {donation.city} - {new Date(donation.donation_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {donation.people_helped} personnes aidées
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Statistiques par Ville</h2>
            <MapPin className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {cityStats?.slice(0, 5).map((stat) => (
              <div key={stat.city} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">{stat.city}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{stat.donations} dons</p>
                  <p className="text-sm text-gray-600">{stat.people_helped} aidés</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Tendances des 6 derniers mois</h2>
          <Calendar className="text-gray-400" />
        </div>
        <div className="space-y-4">
          {trends?.map((trend) => (
            <div key={trend.month} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{trend.month}</p>
                <p className="text-sm text-gray-600">{trend.donations} dons</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{trend.people_helped} personnes aidées</p>
                <p className="text-sm text-gray-600">Taux de succès: {trend.success_rate}%</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;