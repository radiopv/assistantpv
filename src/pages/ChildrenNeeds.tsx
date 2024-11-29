import { useQuery } from "@tanstack/react-query";
import { Plus, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AddNeedDialog } from "@/components/Needs/AddNeedDialog";
import { NeedsList } from "@/components/Needs/NeedsList";
import { Need, convertJsonToNeeds } from "@/types/needs";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function ChildrenNeeds() {
  const { toast } = useToast();
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [newNeed, setNewNeed] = useState<Need>({
    categories: [],
    description: "",
    is_urgent: false
  });

  // Fetch children data
  const { data: children = [], isLoading } = useQuery({
    queryKey: ['children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('id, name, needs');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Handle child selection in dialog
  const handleChildSelect = (childId: string) => {
    const child = children.find(c => c.id === childId);
    setSelectedChild(child);
  };

  // Handle need changes in dialog
  const handleNeedChange = (updates: Partial<Need>) => {
    setNewNeed(prev => ({ ...prev, ...updates }));
  };

  // Add new need
  const handleAddNeed = async () => {
    if (!selectedChild) return;

    try {
      const currentNeeds = convertJsonToNeeds(selectedChild.needs);
      const updatedNeeds = [...currentNeeds, newNeed];

      const { error } = await supabase
        .from('children')
        .update({ needs: updatedNeeds })
        .eq('id', selectedChild.id);

      if (error) throw error;

      toast({
        title: "Besoin ajouté",
        description: "Le besoin a été ajouté avec succès",
      });

      // Reset form
      setNewNeed({
        categories: [],
        description: "",
        is_urgent: false
      });
      setSelectedChild(null);

    } catch (error) {
      console.error('Error adding need:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du besoin",
        variant: "destructive",
      });
    }
  };

  // Toggle need urgency
  const handleToggleUrgent = async (childId: string, needIndex: number) => {
    try {
      const child = children.find(c => c.id === childId);
      if (!child) return;

      const needs = convertJsonToNeeds(child.needs);
      needs[needIndex].is_urgent = !needs[needIndex].is_urgent;

      const { error } = await supabase
        .from('children')
        .update({ needs })
        .eq('id', childId);

      if (error) throw error;

      toast({
        title: "Statut mis à jour",
        description: "Le statut d'urgence a été mis à jour",
      });

    } catch (error) {
      console.error('Error toggling urgency:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      });
    }
  };

  // Delete need
  const handleDeleteNeed = async (childId: string, needIndex: number) => {
    try {
      const child = children.find(c => c.id === childId);
      if (!child) return;

      const needs = convertJsonToNeeds(child.needs);
      needs.splice(needIndex, 1);

      const { error } = await supabase
        .from('children')
        .update({ needs })
        .eq('id', childId);

      if (error) throw error;

      toast({
        title: "Besoin supprimé",
        description: "Le besoin a été supprimé avec succès",
      });

    } catch (error) {
      console.error('Error deleting need:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-gray-600">Chargement...</div>
    </div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Besoins des enfants</h1>
        <AddNeedDialog
          children={children}
          selectedChild={selectedChild}
          newNeed={newNeed}
          onChildSelect={handleChildSelect}
          onNeedChange={handleNeedChange}
          onAddNeed={handleAddNeed}
        />
      </div>

      <div className="grid gap-6">
        {children.map((child) => {
          const needs = convertJsonToNeeds(child.needs);
          if (needs.length === 0) return null;

          return (
            <NeedsList
              key={child.id}
              childId={child.id}
              childName={child.name}
              needs={needs}
              onToggleUrgent={handleToggleUrgent}
              onDeleteNeed={handleDeleteNeed}
            />
          );
        })}
      </div>
    </div>
  );
}