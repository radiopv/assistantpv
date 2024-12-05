import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Clock, CheckCircle } from "lucide-react";
import { Sponsorship } from "@/types/supabase/tables/sponsorships";

export const SponsorshipStats = () => {
  const { data: stats } = useQuery({
    queryKey: ["sponsorship-stats"],
    queryFn: async () => {
      const { data: sponsorships, error } = await supabase
        .from("sponsorships")
        .select("*") as { data: Sponsorship[] | null, error: any };

      if (error) throw error;

      const total = sponsorships?.length || 0;
      const active = sponsorships?.filter((s) => s.status === "active").length || 0;
      const pending = sponsorships?.filter((s) => s.status === "pending").length || 0;

      return { total, active, pending };
    },
  });

  const statCards = [
    {
      title: "Total Parrainages",
      value: stats?.total || 0,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Parrainages Actifs",
      value: stats?.active || 0,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "En Attente",
      value: stats?.pending || 0,
      icon: Clock,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {statCards.map(({ title, value, icon: Icon, color }) => (
        <Card key={title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className={`h-4 w-4 text-${color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};