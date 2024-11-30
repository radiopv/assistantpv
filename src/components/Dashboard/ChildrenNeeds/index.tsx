import { useState } from "react";
import { Need } from "@/types/needs";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { convertNeedsToJson } from "@/types/needs";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { NeedForm } from "./NeedForm";
import { NeedsList } from "./NeedsList";
import { NeedsStats } from "./NeedsStats";
import { ChildrenFilter } from "./ChildrenFilter";

export const ChildrenNeeds = ({ children, isLoading, onNeedsUpdate }: { 
  children: any[];
  isLoading: boolean;
  onNeedsUpdate: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<any | null>(null);
  const [selectedNeeds, setSelectedNeeds] = useState<Need[]>([]);
  const [filters, setFilters] = useState({
    category: "",
    urgentOnly: false,
    searchTerm: ""
  });

  const handleAddNeeds = async () => {
    if (!selectedChild) return;

    try {
      const updatedNeeds = [...(selectedChild.needs || []), ...selectedNeeds];
      const { error } = await supabase
        .from('children')
        .update({ needs: convertNeedsToJson(updatedNeeds) })
        .eq('id', selectedChild.id);

      if (error) throw error;

      toast.success("Besoins ajoutés avec succès");
      setSelectedNeeds([]);
      setSelectedChild(null);
      setIsOpen(false);
      onNeedsUpdate();
    } catch (error) {
      toast.error("Erreur lors de l'ajout des besoins");
      console.error("Erreur:", error);
    }
  };

  const filteredChildren = children
    .filter(child => {
      const hasNeeds = (child.needs || []).length > 0;
      const matchesSearch = child.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesCategory = !filters.category || 
        (child.needs || []).some((need: Need) => need.category === filters.category);
      const matchesUrgent = !filters.urgentOnly || 
        (child.needs || []).some((need: Need) => need.is_urgent);
      
      return hasNeeds && matchesSearch && matchesCategory && matchesUrgent;
    })
    .sort((a, b) => {
      // Prioritize children with urgent needs
      const aHasUrgent = (a.needs || []).some((need: Need) => need.is_urgent);
      const bHasUrgent = (b.needs || []).some((need: Need) => need.is_urgent);
      if (aHasUrgent && !bHasUrgent) return -1;
      if (!aHasUrgent && bHasUrgent) return 1;
      return a.name.localeCompare(b.name);
    });

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
                Ajouter des besoins
                <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <NeedForm
                selectedNeeds={selectedNeeds}
                setSelectedNeeds={setSelectedNeeds}
                onSubmit={handleAddNeeds}
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

      {filteredChildren.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Aucun enfant n'a de besoins correspondant à vos critères
        </div>
      )}
    </div>
  );
};