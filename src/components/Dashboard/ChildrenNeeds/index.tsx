import { useState } from "react";
import { Need } from "@/types/needs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AddNeedForm } from "./AddNeedForm";
import { ChildNeedsList } from "./ChildNeedsList";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface ChildrenNeedsProps {
  children: any[];
  isLoading: boolean;
  onNeedsUpdate: () => void;
}

export const ChildrenNeeds = ({ children, isLoading, onNeedsUpdate }: ChildrenNeedsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<any | null>(null);
  const [newNeed, setNewNeed] = useState<Need>({ 
    categories: [], 
    description: "", 
    is_urgent: false 
  });

  const handleAddNeed = async () => {
    if (!selectedChild || !newNeed.categories.length || !newNeed.description) return;

    const updatedNeeds = [...(selectedChild.needs || []), newNeed];
    
    const { error } = await supabase
      .from('children')
      .update({ needs: updatedNeeds })
      .eq('id', selectedChild.id);

    if (error) {
      console.error('Error updating needs:', error);
      return;
    }

    setNewNeed({ categories: [], description: "", is_urgent: false });
    setIsOpen(false);
    onNeedsUpdate();
  };

  const handleDeleteNeed = async (childId: string, needIndex: number) => {
    const child = children.find(c => c.id === childId);
    if (!child) return;

    const updatedNeeds = child.needs.filter((_: any, i: number) => i !== needIndex);
    
    const { error } = await supabase
      .from('children')
      .update({ needs: updatedNeeds })
      .eq('id', childId);

    if (error) {
      console.error('Error deleting need:', error);
      return;
    }

    onNeedsUpdate();
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
            <Card key={i} className="p-4">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </Card>
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
            <Select
              value={selectedChild?.id || ""}
              onValueChange={(value) => {
                const child = children?.find(c => c.id === value);
                setSelectedChild(child || null);
              }}
            >
              <SelectTrigger className="bg-white mb-4">
                <SelectValue placeholder="Sélectionner un enfant" />
              </SelectTrigger>
              <SelectContent>
                {sortedChildren?.map((child) => (
                  <SelectItem key={child.id} value={child.id}>
                    {child.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedChild && (
              <AddNeedForm
                selectedChild={selectedChild}
                newNeed={newNeed}
                setNewNeed={setNewNeed}
                onSubmit={handleAddNeed}
              />
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sortedChildren?.map((child) => (
          <ChildNeedsList
            key={child.id}
            childName={child.name}
            needs={child.needs || []}
            onDeleteNeed={(index) => handleDeleteNeed(child.id, index)}
          />
        ))}
      </div>
    </div>
  );
};