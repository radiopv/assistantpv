import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BadgeCard } from "@/components/Rewards/BadgeCard";
import { LevelCard } from "@/components/Rewards/LevelCard";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";

const Rewards = () => {
  const { user } = useAuth();

  const { data: badges, isLoading: isLoadingBadges } = useQuery({
    queryKey: ["badges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("badges")
        .select("*")
        .order("points");
      
      if (error) throw error;
      return data;
    }
  });

  const { data: achievements, isLoading: isLoadingAchievements } = useQuery({
    queryKey: ["achievements", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_achievements")
        .select("*")
        .eq("sponsor_id", user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const { data: levels, isLoading: isLoadingLevels } = useQuery({
    queryKey: ["sponsor_levels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsor_levels")
        .select("*")
        .order("min_points");
      
      if (error) throw error;
      return data;
    }
  });

  const isLoading = isLoadingBadges || isLoadingAchievements || isLoadingLevels;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px]" />
          ))}
        </div>
      </div>
    );
  }

  const userPoints = user?.total_points || 0;
  const currentLevel = levels?.find(level => level.id === user?.current_level_id);
  const nextLevel = levels?.find(level => level.min_points > userPoints);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-4">Niveau et Progression</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {levels?.map(level => (
            <LevelCard
              key={level.id}
              name={level.name}
              description={level.description}
              currentPoints={userPoints}
              requiredPoints={level.min_points}
              benefits={level.benefits?.features || []}
              isCurrent={level.id === currentLevel?.id}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Badges et Récompenses</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {badges?.map(badge => {
            const achievement = achievements?.find(a => a.badge_id === badge.id);
            const progress = 0; // TODO: Calculate actual progress
            
            return (
              <BadgeCard
                key={badge.id}
                name={badge.name}
                description={badge.description}
                icon={badge.icon}
                points={badge.points}
                isUnlocked={!!achievement}
                progress={progress}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Rewards;