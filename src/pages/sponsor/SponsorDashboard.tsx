import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/Auth/AuthProvider";
import { ContributionStats } from "@/components/Sponsors/Dashboard/ContributionStats";
import { SponsorshipTimeline } from "@/components/Sponsors/Dashboard/SponsorshipTimeline";
import { DetailedNotification } from "@/components/Sponsors/Dashboard/DetailedNotification";
import { DashboardHeader } from "@/components/Sponsors/Dashboard/Sections/DashboardHeader";
import { SponsoredChildrenSection } from "@/components/Sponsors/Dashboard/Sections/SponsoredChildrenSection";
import { PlannedVisitsSection } from "@/components/Sponsors/Dashboard/Sections/PlannedVisitsSection";

const SponsorDashboard = () => {
  const { user } = useAuth();
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  const { data: sponsoredChildren, isLoading: childrenLoading } = useQuery({
    queryKey: ["sponsored-children", user?.id],
    queryFn: async () => {
      console.log("Fetching sponsored children for user:", user?.id);
      const { data: sponsorships, error } = await supabase
        .from('sponsorships')
        .select(`
          id,
          child_id,
          start_date,
          children (
            id,
            name,
            photo_url,
            city,
            birth_date,
            description,
            story,
            needs,
            age
          )
        `)
        .eq('sponsor_id', user?.id)
        .eq('status', 'active');

      if (error) {
        console.error("Error fetching sponsorships:", error);
        throw error;
      }
      console.log("Fetched sponsorships:", sponsorships);
      return sponsorships || [];
    },
    enabled: !!user?.id
  });

  const { data: plannedVisits = [], refetch: refetchVisits } = useQuery({
    queryKey: ['planned-visits', user?.id],
    queryFn: async () => {
      console.log("Fetching planned visits for user:", user?.id);
      const { data, error } = await supabase
        .from('planned_visits')
        .select('*')
        .eq('sponsor_id', user?.id)
        .order('start_date', { ascending: true });

      if (error) {
        console.error("Error fetching planned visits:", error);
        throw error;
      }
      console.log("Fetched planned visits:", data);
      return data;
    },
    enabled: !!user?.id
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['sponsor-notifications', user?.id],
    queryFn: async () => {
      console.log("Fetching notifications for user:", user?.id);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }
      console.log("Fetched notifications:", data);
      return data;
    },
    enabled: !!user?.id
  });

  const handleAddPhoto = (childId: string) => {
    setSelectedChild(childId);
  };

  const handleUploadSuccess = () => {
    if (selectedChild) {
      toast.success("Photo ajoutée avec succès");
      setSelectedChild(null);
    }
  };

  if (!user?.id) {
    return <div className="text-center p-4">Accès non autorisé</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige/20 to-cuba-offwhite p-4">
      <div className="container mx-auto space-y-6">
        <DashboardHeader />

        <div className="grid gap-6">
          {/* Contribution Stats */}
          {user?.id && <ContributionStats sponsorId={user.id} />}

          {/* Planned Visits */}
          <PlannedVisitsSection 
            userId={user.id}
            plannedVisits={plannedVisits}
            onVisitPlanned={() => refetchVisits()}
          />

          {/* Sponsored Children */}
          <SponsoredChildrenSection
            sponsoredChildren={sponsoredChildren || []}
            selectedChild={selectedChild}
            onAddPhoto={handleAddPhoto}
            onUploadSuccess={handleUploadSuccess}
          />

          {/* Timeline */}
          <SponsorshipTimeline events={[]} />

          {/* Notifications */}
          {notifications?.map((notification) => (
            <DetailedNotification key={notification.id} notification={notification} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorDashboard;