import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, GiftIcon, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Statistics {
  children_stats: {
    sponsored_count: number;
  };
  sponsor_stats: {
    active_count: number;
  };
  donation_stats: {
    total_count: number;
  };
  location_stats: {
    city_count: number;
  };
}

export const GlobalStats = () => {
  const { data: stats, isLoading } = useQuery<Statistics>({
    queryKey: ["global-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_current_statistics");
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Enfants Parrainés",
      value: stats?.children_stats?.sponsored_count || 0,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Parrains Actifs",
      value: stats?.sponsor_stats?.active_count || 0,
      icon: Heart,
      color: "text-red-500",
    },
    {
      title: "Dons Réalisés",
      value: stats?.donation_stats?.total_count || 0,
      icon: GiftIcon,
      color: "text-green-500",
    },
    {
      title: "Villes Couvertes",
      value: stats?.location_stats?.city_count || 0,
      icon: MapPin,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map(({ title, value, icon: Icon, color }) => (
        <Card key={title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className={`h-4 w-4 ${color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};