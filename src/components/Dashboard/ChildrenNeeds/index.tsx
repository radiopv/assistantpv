import { useState } from "react";
import { Need } from "@/types/needs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ChevronDown } from "lucide-react";
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
    if (selectedChildren.length === 0) return;

    try {
      // Mettre à jour chaque enfant sélectionné
      for (const child of selectedChildren) {
        const updatedNeeds = [...(child.needs || []), newNeed];
        const { error } = await supabase
          .from('children')
          .update({ needs: convertNeedsToJson(updatedNeeds) })
          .eq('id', child.id);

        if (error) throw error;
      }

      toast.success(`Besoin ajouté avec succès pour ${selectedChildren.length} enfant(s)`);
      setNewNeed({ category: "", description: "", is_urgent: false });
      setSelectedChildren([]);
      setIsOpen(false);
      onNeedsUpdate();
    } catch (error) {
      toast.error("Erreur lors de l'ajout du besoin");
      console.error("Erreur:", error);
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
        {sortedChildren?.map((child) => (
          <ChildNeeds key={child.id} child={child} needs={child.needs || []} />
        ))}
      </div>
    </div>
  );
};