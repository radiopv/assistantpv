import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Clock, CheckCircle } from "lucide-react";

export const SponsorshipStats = () => {
  const { data: stats } = useQuery({
    queryKey: ["sponsorship-stats"],
    queryFn: async () => {
      const { data: sponsorships, error } = await supabase
        .from("sponsorships")
        .select("status");

      if (error) throw error;

      const total = sponsorships.length;
      const active = sponsorships.filter((s) => s.status === "active").length;
      const pending = sponsorships.filter((s) => s.status === "pending").length;

      return { total, active, pending };
    },
  });

  const statCards = [
    {
      title: "Total Parrainages",
      value: stats?.total || 0,
      icon: Users,
      color: "bg-cuba-turquoise",
      textColor: "text-cuba-turquoise",
      bgColor: "bg-cuba-turquoise/10",
    },
    {
      title: "Parrainages Actifs",
      value: stats?.active || 0,
      icon: CheckCircle,
      color: "bg-cuba-emerald",
      textColor: "text-cuba-emerald",
      bgColor: "bg-cuba-emerald/10",
    },
    {
      title: "En Attente",
      value: stats?.pending || 0,
      icon: Clock,
      color: "bg-cuba-gold",
      textColor: "text-cuba-gold",
      bgColor: "bg-cuba-gold/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {statCards.map(({ title, value, icon: Icon, color, textColor, bgColor }) => (
        <Card key={title} className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            <div className={`rounded-full p-2 ${bgColor}`}>
              <Icon className={`h-4 w-4 ${textColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${textColor}`}>
              {value.toLocaleString('fr-FR')}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};