import { useState } from "react";
import { Need } from "@/types/needs";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { convertNeedsToJson } from "@/types/needs";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AddNeedForm } from "./AddNeedForm";
import { ChildNeeds } from "./ChildNeeds";

export const ChildrenNeeds = ({ children, isLoading, onNeedsUpdate }: { 
  children: any[];
  isLoading: boolean;
  onNeedsUpdate: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChildren, setSelectedChildren] = useState<any[]>([]);
  const [newNeed, setNewNeed] = useState<Need>({ 
    category: "", 
    description: "", 
    is_urgent: false 
  });

  const handleAddNeed = async () => {
    if (selectedChildren.length === 0) {
      toast.error("Veuillez sélectionner au moins un enfant");
      return;
    }

    if (!newNeed.category || !newNeed.description) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      // Mettre à jour chaque enfant sélectionné
      for (const child of selectedChildren) {
        const currentNeeds = Array.isArray(child.needs) ? child.needs : [];
        const updatedNeeds = [
          ...currentNeeds,
          {
            category: newNeed.category,
            description: newNeed.description,
            is_urgent: newNeed.is_urgent
          }
        ];

        const { error } = await supabase
          .from('children')
          .update({ needs: convertNeedsToJson(updatedNeeds) })
          .eq('id', child.id);

        if (error) throw error;

        // Notify sponsor if child is sponsored
        if (child.sponsorships?.[0]?.sponsor) {
          const sponsor = child.sponsorships[0].sponsor;
          await sendNotification(sponsor.id, {
            title: "Nouveau besoin",
            content: `Un nouveau besoin a été ajouté pour ${child.name}: ${newNeed.category}${newNeed.is_urgent ? ' (URGENT)' : ''}`,
            type: "need"
          });
        }
      }

      toast.success(`Besoin ajouté avec succès pour ${selectedChildren.length} enfant(s)`);
      setNewNeed({ category: "", description: "", is_urgent: false });
      setSelectedChildren([]);
      setIsOpen(false);
      onNeedsUpdate();
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de l'ajout du besoin");
    }
  };

  const handleDeleteNeed = async (childId: string, needIndex: number) => {
    try {
      const child = children.find(c => c.id === childId);
      if (!child) return;

      const currentNeeds = Array.isArray(child.needs) ? child.needs : [];
      const updatedNeeds = currentNeeds.filter((_, index) => index !== needIndex);
      
      const { error } = await supabase
        .from('children')
        .update({ needs: convertNeedsToJson(updatedNeeds) })
        .eq('id', childId);

      if (error) throw error;

      toast.success("Besoin supprimé avec succès");
      onNeedsUpdate();
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la suppression du besoin");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const sortedChildren = [...children].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-semibold">Besoins des Enfants</h2>
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full md:w-auto">
          <CollapsibleTrigger asChild>
            <Button className="w-full md:w-auto bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un besoin
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <AddNeedForm
              children={children}
              selectedChildren={selectedChildren}
              newNeed={newNeed}
              setSelectedChildren={setSelectedChildren}
              setNewNeed={setNewNeed}
              onSubmit={handleAddNeed}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sortedChildren.length > 0 ? (
          sortedChildren.map((child) => (
            <ChildNeeds 
              key={child.id} 
              child={child} 
              needs={child.needs || []} 
              onDeleteNeed={(needIndex) => handleDeleteNeed(child.id, needIndex)}
            />
          ))
        ) : (
          <div className="col-span-2 text-center py-12 bg-gray-50 rounded-lg">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">Aucun enfant trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

const sendNotification = async (sponsorId: string, notification: { title: string; content: string; type: string }) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        recipient_id: sponsorId,
        title: notification.title,
        content: notification.content,
        type: notification.type
      });

    if (error) throw error;
  } catch (error) {
    console.error("Erreur lors de l'envoi de la notification:", error);
  }
};