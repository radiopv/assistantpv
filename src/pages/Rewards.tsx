import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BadgeCard } from "@/components/Rewards/BadgeCard";
import { LevelCard } from "@/components/Rewards/LevelCard";
import { BadgeProgress } from "@/components/Rewards/BadgeProgress";
import { ActionsList } from "@/components/Rewards/ActionsList";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <h2 className="text-2xl font-bold mb-6">Récompenses et Progression</h2>
        
        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList>
            <TabsTrigger value="progress">Progression</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {levels?.map(level => {
                const benefitsArray = level.benefits && typeof level.benefits === 'object' 
                  ? (level.benefits as { features?: string[] }).features || []
                  : [];

                return (
                  <LevelCard
                    key={level.id}
                    name={level.name}
                    description={level.description}
                    currentPoints={userPoints}
                    requiredPoints={level.min_points}
                    benefits={benefitsArray}
                    isCurrent={level.id === currentLevel?.id}
                  />
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {badges?.map(badge => {
                const achievement = achievements?.find(a => a.badge_id === badge.id);
                const progress = achievement ? 100 : 
                  Math.min((userPoints / badge.points) * 100, 100);
                
                return (
                  <BadgeProgress
                    key={badge.id}
                    name={badge.name}
                    description={badge.description}
                    currentPoints={userPoints}
                    requiredPoints={badge.points}
                    category={badge.category}
                    isUnlocked={!!achievement}
                  />
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="actions">
            <ActionsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Rewards;