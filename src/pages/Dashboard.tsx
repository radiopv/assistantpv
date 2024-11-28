import { Card } from "@/components/ui/card";
import { Users, Gift, AlertTriangle, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "@/components/ErrorAlert";
import { SponsorshipList } from "@/components/Sponsorship/SponsorshipList";
import { SponsorshipStats } from "@/components/Sponsorship/SponsorshipStats";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Need, convertJsonToNeeds, convertNeedsToJson } from "@/types/needs";
import { NeedsList } from "@/components/Needs/NeedsList";
import { AddNeedDialog } from "@/components/Needs/AddNeedDialog";
import { DashboardStats } from "@/types/dashboard";
import { useQueryClient } from "@tanstack/react-query";

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [selectedChild, setSelectedChild] = useState<any | null>(null);
  const [newNeed, setNewNeed] = useState<Need>({ 
    category: "", 
    description: "", 
    is_urgent: false 
  });

  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_dashboard_statistics');
      if (error) throw error;
      return data as unknown as DashboardStats;
    },
    retry: 1,
    meta: {
      errorMessage: "Erreur lors du chargement des statistiques",
      onError: (error: Error) => {
        console.error('Query error:', error);
        toast.error("Erreur lors du chargement des statistiques");
      }
    }
  });

  const { data: children, isLoading: childrenLoading } = useQuery({
    queryKey: ['children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('id, name, needs');
      if (error) throw error;
      return data.map(child => ({
        ...child,
        needs: convertJsonToNeeds(child.needs)
      }));
    }
  });

  // Souscription aux changements en temps réel
  useEffect(() => {
    const channel = supabase
      .channel('children-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'children'
        },
        (payload) => {
          // Invalider le cache pour forcer un rafraîchissement
          queryClient.invalidateQueries({ queryKey: ['children'] });
          
          // Notification visuelle du changement
          toast.success("Les besoins ont été mis à jour");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleAddNeed = async () => {
    if (!selectedChild) return;

    const updatedNeeds = [...(selectedChild.needs || []), newNeed];
    const { error } = await supabase
      .from('children')
      .update({ needs: convertNeedsToJson(updatedNeeds) })
      .eq('id', selectedChild.id);

    if (error) {
      toast.error("Erreur lors de l'ajout du besoin");
      return;
    }

    toast.success("Besoin ajouté avec succès");
    setNewNeed({ category: "", description: "", is_urgent: false });
    setSelectedChild({ ...selectedChild, needs: updatedNeeds });
  };

  const handleToggleUrgent = async (childId: string, needIndex: number) => {
    const child = children?.find(c => c.id === childId);
    if (!child) return;

    const updatedNeeds = [...child.needs];
    updatedNeeds[needIndex] = {
      ...updatedNeeds[needIndex],
      is_urgent: !updatedNeeds[needIndex].is_urgent
    };

    const { error } = await supabase
      .from('children')
      .update({ needs: convertNeedsToJson(updatedNeeds) })
      .eq('id', childId);

    if (error) {
      toast.error("Erreur lors de la mise à jour du besoin");
      return;
    }

    toast.success("Besoin mis à jour avec succès");
  };

  const handleDeleteNeed = async (childId: string, needIndex: number) => {
    const child = children?.find(c => c.id === childId);
    if (!child) return;

    const updatedNeeds = child.needs.filter((_, index) => index !== needIndex);

    const { error } = await supabase
      .from('children')
      .update({ needs: convertNeedsToJson(updatedNeeds) })
      .eq('id', childId);

    if (error) {
      toast.error("Erreur lors de la suppression du besoin");
      return;
    }

    toast.success("Besoin supprimé avec succès");
  };

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

  if (statsLoading || childrenLoading) {
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

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Besoins des Enfants</h2>
          <AddNeedDialog
            children={children || []}
            selectedChild={selectedChild}
            newNeed={newNeed}
            onChildSelect={(value) => {
              const child = children?.find(c => c.id === value);
              setSelectedChild(child || null);
            }}
            onNeedChange={(partialNeed) => setNewNeed({ ...newNeed, ...partialNeed })}
            onAddNeed={handleAddNeed}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {children?.map((child) => (
            <NeedsList
              key={child.id}
              childId={child.id}
              childName={child.name}
              needs={child.needs}
              onToggleUrgent={handleToggleUrgent}
              onDeleteNeed={handleDeleteNeed}
            />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Gestion des Parrainages</h2>
        <SponsorshipStats />
        <SponsorshipList />
      </div>
    </div>
  );
};

export default Dashboard;