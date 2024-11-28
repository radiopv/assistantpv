import { Card } from "@/components/ui/card";
import { Users, Gift, AlertTriangle, MapPin, Plus, Check, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "@/components/ErrorAlert";
import { SponsorshipList } from "@/components/Sponsorship/SponsorshipList";
import { SponsorshipStats } from "@/components/Sponsorship/SponsorshipStats";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Json } from "@/integrations/supabase/types";

interface DashboardStats {
  children: {
    total: number;
    sponsored: number;
    available: number;
    urgent_needs: number;
  };
  sponsors: number;
  donations: {
    total: number;
    people_helped: number;
  };
  cities: number;
}

interface Need {
  category: string;
  description: string;
  is_urgent: boolean;
}

interface Child {
  id: string;
  name: string;
  needs: Need[];
}

interface SupabaseChild {
  id: string;
  name: string;
  needs: Json;
}

const convertJsonToNeeds = (jsonNeeds: Json): Need[] => {
  if (!Array.isArray(jsonNeeds)) return [];
  return jsonNeeds.map(need => ({
    category: String(need?.category || ''),
    description: String(need?.description || ''),
    is_urgent: Boolean(need?.is_urgent || false)
  }));
};

const Dashboard = () => {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [newNeed, setNewNeed] = useState<Need>({ 
    category: "", 
    description: "", 
    is_urgent: false 
  });

  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_dashboard_statistics');
      if (error) {
        console.error('Error fetching dashboard stats:', error);
        throw new Error(error.message);
      }
      return (data as unknown) as DashboardStats;
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
      
      return (data as SupabaseChild[]).map(child => ({
        ...child,
        needs: convertJsonToNeeds(child.needs)
      }));
    }
  });

  const handleAddNeed = async () => {
    if (!selectedChild) return;

    const updatedNeeds = [...(selectedChild.needs || []), newNeed];
    const { error } = await supabase
      .from('children')
      .update({ needs: updatedNeeds })
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
      .update({ needs: updatedNeeds })
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
      .update({ needs: updatedNeeds })
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
          retry={() => {
            refetchStats();
          }}
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

  // ... keep existing code (render JSX)

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
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un besoin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un besoin</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Select
                  value={selectedChild?.id || ""}
                  onValueChange={(value) => {
                    const child = children?.find(c => c.id === value);
                    setSelectedChild(child || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un enfant" />
                  </SelectTrigger>
                  <SelectContent>
                    {children?.map((child) => (
                      <SelectItem key={child.id} value={child.id}>
                        {child.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={newNeed.category}
                  onValueChange={(value) => setNewNeed({ ...newNeed, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Catégorie du besoin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="education">Éducation</SelectItem>
                    <SelectItem value="jouet">Jouet</SelectItem>
                    <SelectItem value="vetement">Vêtement</SelectItem>
                    <SelectItem value="nourriture">Nourriture</SelectItem>
                    <SelectItem value="medicament">Médicament</SelectItem>
                    <SelectItem value="hygiene">Hygiène</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Description du besoin"
                  value={newNeed.description}
                  onChange={(e) => setNewNeed({ ...newNeed, description: e.target.value })}
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="urgent"
                    checked={newNeed.is_urgent}
                    onChange={(e) => setNewNeed({ ...newNeed, is_urgent: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="urgent">Urgent</label>
                </div>

                <Button onClick={handleAddNeed} disabled={!selectedChild || !newNeed.category || !newNeed.description}>
                  Ajouter
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {children?.map((child) => (
            <Card key={child.id} className="p-6">
              <h3 className="text-lg font-semibold mb-4">{child.name}</h3>
              <div className="space-y-2">
                {child.needs?.map((need, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{need.category}</p>
                      <p className="text-sm text-gray-600">{need.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant={need.is_urgent ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => handleToggleUrgent(child.id, index)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteNeed(child.id, index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {(!child.needs || child.needs.length === 0) && (
                  <p className="text-gray-500 text-center py-2">Aucun besoin enregistré</p>
                )}
              </div>
            </Card>
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
