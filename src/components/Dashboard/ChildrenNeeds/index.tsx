import { useState } from "react";
import { Need } from "@/types/needs";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { convertNeedsToJson } from "@/types/needs";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AddNeedForm } from "./AddNeedForm";
import { NeedsList } from "./NeedsList";
import { NeedsStats } from "./NeedsStats";
import { ChildrenFilter } from "./ChildrenFilter";

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
  const [filters, setFilters] = useState({
    category: "",
    urgentOnly: false,
    searchTerm: ""
  });

  const handleAddNeed = async () => {
    if (selectedChildren.length === 0) return;

    try {
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

  const filteredChildren = children.filter(child => {
    const matchesSearch = child.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesCategory = !filters.category || 
      (child.needs || []).some((need: Need) => need.category === filters.category);
    const matchesUrgent = !filters.urgentOnly || 
      (child.needs || []).some((need: Need) => need.is_urgent);
    
    return matchesSearch && matchesCategory && matchesUrgent;
  }).sort((a, b) => a.name.localeCompare(b.name));

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-semibold">Besoins des Enfants</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFilters(prev => ({ ...prev, urgentOnly: !prev.urgentOnly }))}
            className={filters.urgentOnly ? "bg-red-50" : ""}
          >
            <Filter className="w-4 h-4 mr-2" />
            Besoins urgents
          </Button>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
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
      </div>

      <NeedsStats children={children} />
      
      <ChildrenFilter filters={filters} setFilters={setFilters} />

      <div className="grid gap-6 md:grid-cols-2">
        {filteredChildren.map((child) => (
          <NeedsList key={child.id} child={child} needs={child.needs || []} />
        ))}
      </div>
    </div>
  );
};