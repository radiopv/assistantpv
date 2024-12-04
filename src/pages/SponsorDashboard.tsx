import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { NotificationBar } from "@/components/Dashboard/NotificationBar";
import { MessageList } from "@/components/Messages/MessageList";
import { ChildrenList } from "@/components/Children/ChildrenList";
import { BadgeCard } from "@/components/Rewards/BadgeCard";
import { LevelCard } from "@/components/Rewards/LevelCard";
import { useNavigate } from "react-router-dom";
import { Award, Users, MessageSquare } from "lucide-react";

const SponsorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch sponsor's children through sponsorships
  const { data: sponsoredChildren, isLoading: isLoadingChildren } = useQuery({
    queryKey: ['sponsored-children', user?.id],
    queryFn: async () => {
      const { data: sponsorships, error: sponsorshipsError } = await supabase
        .from('sponsorships')
        .select(`
          child:children(*)
        `)
        .eq('sponsor_id', user?.id)
        .eq('status', 'active');
      
      if (sponsorshipsError) throw sponsorshipsError;
      
      // Extract children from sponsorships
      return sponsorships?.map(s => s.child) || [];
    },
    enabled: !!user?.id
  });

  const { data: achievements, isLoading: isLoadingAchievements } = useQuery({
    queryKey: ['achievements', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          badge:badges(*)
        `)
        .eq('sponsor_id', user?.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  // Fetch sponsor's current level
  const { data: sponsorData } = useQuery({
    queryKey: ['sponsor-data', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select(`
          *,
          current_level:sponsor_levels(*)
        `)
        .eq('id', user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const handleViewProfile = (childId: string) => {
    navigate(`/children/${childId}`);
  };

  const handleSelectMessage = (message: any) => {
    // Handle message selection
    console.log('Selected message:', message);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header with notifications */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-gray-600">Bienvenue, {user?.name || 'Parrain'}</p>
        </div>
        <NotificationBar />
      </div>

      {/* Level Progress Section */}
      {sponsorData?.current_level && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">
                Niveau : {sponsorData.current_level.name}
              </h3>
              <p className="text-sm text-gray-500">
                {sponsorData.total_points || 0} points accumulés
              </p>
            </div>
            <Award className="h-8 w-8 text-primary" />
          </div>
          <Progress 
            value={((sponsorData.total_points || 0) / (sponsorData.current_level.min_points || 100)) * 100} 
            className="h-2" 
          />
        </Card>
      )}

      {/* Sponsored Children Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">Mes enfants parrainés</h2>
        </div>
        <ChildrenList 
          children={sponsoredChildren || []} 
          isLoading={isLoadingChildren}
          onViewProfile={handleViewProfile}
        />
      </div>

      {/* Messages Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">Messages récents</h2>
        </div>
        <MessageList onSelectMessage={handleSelectMessage} />
      </div>

      {/* Achievements Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">Mes récompenses</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {achievements?.map((achievement) => (
            <BadgeCard
              key={achievement.id}
              name={achievement.badge.name}
              description={achievement.badge.description}
              icon={achievement.badge.icon}
              points={achievement.badge.points}
              isUnlocked={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorDashboard;
