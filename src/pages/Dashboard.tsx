import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "@/components/ErrorAlert";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";
import { DetailedStats } from "@/components/Dashboard/DetailedStats";
import { SponsorshipStats } from "@/components/Dashboard/AdvancedStats/SponsorshipStats";
import { AssistantStats } from "@/components/Dashboard/AdvancedStats/AssistantStats";
import { UrgentNeedsStats } from "@/components/Dashboard/AdvancedStats/UrgentNeedsStats";
import { UserEngagementStats } from "@/components/Dashboard/AdvancedStats/UserEngagementStats";
import { useAuth } from "@/components/Auth/AuthProvider";
import { DashboardStats } from "@/types/dashboard";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Users,
  Gift,
  Image,
  UserCog,
  Settings,
  MessageSquare,
  Heart,
  UserPlus,
  FileText,
  BarChart,
  Camera,
  Calendar,
  Mail,
} from "lucide-react";

const Dashboard = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isAssistant = user?.role === 'assistant';

  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: rawData, error } = await supabase.rpc('get_dashboard_statistics');
      if (error) throw error;
      return rawData as DashboardStats;
    },
    meta: {
      errorMessage: "Erreur lors du chargement des statistiques"
    }
  });

  useEffect(() => {
    const channel = supabase
      .channel('dashboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'children'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
          toast.success("Les données ont été mises à jour");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const adminLinks = [
    { to: "/admin/permissions", icon: Settings, label: "Gestion des permissions", color: "bg-purple-100" },
    { to: "/admin/media", icon: Image, label: "Gestion des médias", color: "bg-blue-100" },
    { to: "/admin/sponsors", icon: UserCog, label: "Gestion des parrains", color: "bg-green-100" },
    { to: "/admin/donations", icon: Gift, label: "Gestion des dons", color: "bg-yellow-100" },
    { to: "/admin/statistics", icon: BarChart, label: "Statistiques", color: "bg-indigo-100" },
    { to: "/admin/messages", icon: Mail, label: "Messages", color: "bg-pink-100" },
  ];

  const assistantLinks = [
    { to: "/children", icon: Users, label: "Liste des enfants", color: "bg-blue-100" },
    { to: "/children/add", icon: UserPlus, label: "Ajouter un enfant", color: "bg-green-100" },
    { to: "/children/needs", icon: Heart, label: "Besoins des enfants", color: "bg-red-100" },
    { to: "/sponsorships", icon: Heart, label: "Parrainages", color: "bg-pink-100" },
    { to: "/messages", icon: MessageSquare, label: "Messages", color: "bg-purple-100" },
    { to: "/media", icon: Camera, label: "Médias", color: "bg-indigo-100" },
    { to: "/calendar", icon: Calendar, label: "Calendrier", color: "bg-cyan-100" },
    { to: "/reports", icon: FileText, label: "Rapports", color: "bg-amber-100" },
  ];

  const renderQuickLinks = (links: any[]) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
      {links.map((link) => (
        <Link key={link.to} to={link.to}>
          <Card className={`p-6 hover:shadow-lg transition-shadow ${link.color}`}>
            <div className="flex items-center gap-4">
              <link.icon className="h-8 w-8 text-gray-700" />
              <div className="font-medium text-gray-900">{link.label}</div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );

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

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <DashboardHeader stats={stats} />
      <DetailedStats />
      
      <div className="space-y-8">
        {isAdmin && (
          <>
            <div>
              <h2 className="text-2xl font-bold mb-4">Accès rapide administrateur</h2>
              {renderQuickLinks(adminLinks)}
            </div>
            <SponsorshipStats />
            <div className="grid gap-4 md:grid-cols-2">
              <UrgentNeedsStats />
              <UserEngagementStats />
            </div>
            <AssistantStats />
          </>
        )}
        
        {isAssistant && (
          <>
            <div>
              <h2 className="text-2xl font-bold mb-4">Accès rapide assistant</h2>
              {renderQuickLinks(assistantLinks)}
            </div>
            <UrgentNeedsStats />
            <AssistantStats />
          </>
        )}
        
        {user?.role === 'sponsor' && (
          <div className="grid gap-4 md:grid-cols-2">
            <UrgentNeedsStats />
            <UserEngagementStats />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;