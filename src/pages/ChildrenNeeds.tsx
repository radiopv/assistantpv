import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Need } from "@/types/needs";

const ChildrenNeeds = () => {
  const [selectedChild, setSelectedChild] = useState<any | null>(null);
  const [newNeed, setNewNeed] = useState<Need>({
    categories: [],
    description: "",
    is_urgent: false
  });

  const { data: children, isLoading, refetch } = useQuery({
    queryKey: ['children-needs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('id, name, needs');
      if (error) throw error;
      return data;
    }
  });

  const handleAddNeed = async () => {
    if (!selectedChild || !newNeed.categories.length || !newNeed.description) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

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
    setNewNeed({ categories: [], description: "", is_urgent: false });
    setSelectedChild(null);
    refetch();
  };

  const handleDeleteNeed = async (childId: string, needIndex: number) => {
    const child = children?.find(c => c.id === childId);
    if (!child) return;

    const updatedNeeds = child.needs.filter((_: any, i: number) => i !== needIndex);
    
    const { error } = await supabase
      .from('children')
      .update({ needs: updatedNeeds })
      .eq('id', childId);

    if (error) {
      toast.error("Erreur lors de la suppression du besoin");
      return;
    }

    toast.success("Besoin supprimé avec succès");
    refetch();
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

  const sortedChildren = [...(children || [])].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Besoins des Enfants</h2>
        <div className="flex gap-4">
          <Select
            value={selectedChild?.id || ""}
            onValueChange={(value) => {
              const child = children?.find(c => c.id === value);
              setSelectedChild(child || null);
            }}
          >
            <SelectTrigger className="w-[200px]">
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
            <div className="space-y-4">
              <Select
                value={newNeed.categories[0] || ""}
                onValueChange={(value) => setNewNeed({ ...newNeed, categories: [value] })}
              >
                <SelectTrigger className="w-[200px]">
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
                <Checkbox
                  id="urgent"
                  checked={newNeed.is_urgent}
                  onCheckedChange={(checked) => 
                    setNewNeed({ ...newNeed, is_urgent: checked as boolean })
                  }
                />
                <label htmlFor="urgent" className="text-sm text-gray-600">
                  Besoin urgent
                </label>
              </div>
              <Button 
                onClick={handleAddNeed}
                disabled={!newNeed.categories.length || !newNeed.description}
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sortedChildren?.map((child) => (
          <Card key={child.id} className="p-4">
            <h3 className="text-lg font-semibold mb-4">{child.name}</h3>
            <div className="space-y-4">
              {child.needs?.map((need: Need, index: number) => (
                <div 
                  key={`${need.categories.join('-')}-${index}`}
                  className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm"
                >
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                      {need.categories.map(category => (
                        <Badge 
                          key={category}
                          variant={need.is_urgent ? "destructive" : "default"}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-gray-600">{need.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    onClick={() => handleDeleteNeed(child.id, index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChildrenNeeds;