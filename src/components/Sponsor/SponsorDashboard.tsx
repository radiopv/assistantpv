import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Award, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  badge: {
    id: string;
    name: string;
    description: string;
    points: number;
  };
  earned_at: string | null;
}

interface Sponsorship {
  id: string;
  child: {
    name: string;
  };
  start_date: string;
}

interface SponsorData {
  current_level: {
    name: string;
    min_points: number;
  } | null;
  total_points: number;
  achievements: Achievement[];
  sponsorships: Sponsorship[];
}

export const SponsorDashboard = () => {
  const { user } = useAuth();

  const { data: sponsorData } = useQuery<SponsorData>({
    queryKey: ["sponsor-data", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsors")
        .select(`
          *,
          current_level:sponsor_levels(*),
          achievements:user_achievements(
            badge:badges(*)
          ),
          sponsorships(
            child:children(*)
          )
        `)
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">
              Niveau : {sponsorData?.current_level?.name || "Débutant"}
            </h3>
            <p className="text-sm text-gray-500">
              {sponsorData?.total_points || 0} points accumulés
            </p>
          </div>
          <Star className="h-8 w-8 text-yellow-400" />
        </div>
        <Progress
          value={
            ((sponsorData?.total_points || 0) /
              (sponsorData?.current_level?.min_points || 100)) *
            100
          }
          className="h-2"
        />
      </Card>

      {/* Achievements */}
      <div className="grid gap-4 md:grid-cols-2">
        {sponsorData?.achievements?.map((achievement) => (
          <Card
            key={achievement.id}
            className={cn(
              "p-4 relative transition-all duration-300",
              achievement.earned_at ? "bg-white" : "bg-gray-100"
            )}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "p-2 rounded-full",
                  achievement.earned_at ? "bg-primary/10" : "bg-gray-200"
                )}
              >
                <Award
                  className={cn(
                    "w-8 h-8",
                    achievement.earned_at ? "text-primary" : "text-gray-400"
                  )}
                />
              </div>
              <div>
                <h4 className="font-semibold">{achievement.badge?.name}</h4>
                <p className="text-sm text-gray-600">
                  {achievement.badge?.description}
                </p>
                <Badge
                  variant={achievement.earned_at ? "default" : "secondary"}
                  className="mt-2"
                >
                  {achievement.badge?.points} points
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Sponsorship Timeline */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Historique des parrainages</h3>
        <div className="space-y-4">
          {sponsorData?.sponsorships?.map((sponsorship) => (
            <div
              key={sponsorship.id}
              className="flex items-center gap-4 border-l-2 border-primary pl-4"
            >
              <div>
                <p className="font-medium">{sponsorship.child?.name}</p>
                <p className="text-sm text-gray-500">
                  Depuis le{" "}
                  {new Date(sponsorship.start_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};