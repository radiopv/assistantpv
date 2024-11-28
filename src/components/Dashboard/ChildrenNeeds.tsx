import { useState } from "react";
import { Need } from "@/types/needs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
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
    setSelectedChild(null);
    onNeedsUpdate();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Besoins des Enfants</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
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
                <Checkbox
                  id="urgent"
                  checked={newNeed.is_urgent}
                  onCheckedChange={(checked) => setNewNeed({ ...newNeed, is_urgent: checked as boolean })}
                />
                <label htmlFor="urgent" className="text-sm text-gray-600">Besoin urgent</label>
              </div>

              <Button 
                onClick={handleAddNeed} 
                disabled={!selectedChild || !newNeed.category || !newNeed.description}
                className="w-full"
              >
                Ajouter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {children?.map((child) => (
          <Card key={child.id} className="p-4">
            <h3 className="font-semibold text-lg mb-4">{child.name}</h3>
            <div className="space-y-4">
              {child.needs?.map((need: Need, index: number) => (
                <div 
                  key={`${need.category}-${index}`}
                  className={`p-3 rounded-lg border ${
                    need.is_urgent ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">{need.category}</div>
                      <div className="text-sm text-gray-600">{need.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};