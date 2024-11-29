import { useState } from "react";
import { Need } from "@/types/needs";
import { NeedsList } from "@/components/Needs/NeedsList";
import { AddNeedDialog } from "@/components/Needs/AddNeedDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { convertNeedsToJson } from "@/types/needs";

interface ChildrenNeedsProps {
  children: any[];
  onNeedsUpdate: () => void;
}

export const ChildrenNeeds = ({ children, onNeedsUpdate }: ChildrenNeedsProps) => {
  const [selectedChild, setSelectedChild] = useState<any | null>(null);
  const [newNeed, setNewNeed] = useState<Need>({ 
    category: "", 
    description: "", 
    is_urgent: false 
  });

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
    onNeedsUpdate();
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
    onNeedsUpdate();
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
    onNeedsUpdate();
  };

  return (
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
  );
};