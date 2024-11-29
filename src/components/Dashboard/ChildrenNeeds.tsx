import { useState } from "react";
import { Need } from "@/types/needs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Plus, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { convertNeedsToJson } from "@/types/needs";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Composant pour le formulaire d'ajout de besoin
const AddNeedForm = ({ 
  selectedChild, 
  newNeed, 
  setNewNeed, 
  onSubmit 
}: { 
  selectedChild: any;
  newNeed: Need;
  setNewNeed: (need: Need) => void;
  onSubmit: () => void;
}) => {
  const NEED_CATEGORIES = [
    { value: "education", label: "Éducation" },
    { value: "jouet", label: "Jouet" },
    { value: "vetement", label: "Vêtement" },
    { value: "nourriture", label: "Nourriture" },
    { value: "medicament", label: "Médicament" },
    { value: "hygiene", label: "Hygiène" },
    { value: "autre", label: "Autre" }
  ];

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {NEED_CATEGORIES.map((category) => (
          <div key={category.value} className="flex items-center space-x-2">
            <Checkbox
              id={category.value}
              checked={newNeed.category === category.value}
              onCheckedChange={(checked) => {
                if (checked) {
                  setNewNeed({ ...newNeed, category: category.value });
                }
              }}
            />
            <label htmlFor={category.value} className="text-sm text-gray-600">
              {category.label}
            </label>
          </div>
        ))}
      </div>

      <Input
        placeholder="Description du besoin"
        value={newNeed.description}
        onChange={(e) => setNewNeed({ ...newNeed, description: e.target.value })}
        className="bg-white"
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
        onClick={onSubmit} 
        disabled={!selectedChild || !newNeed.category || !newNeed.description}
        className="w-full"
      >
        Ajouter
      </Button>
    </div>
  );
};

// Composant pour afficher les besoins d'un enfant
const ChildNeeds = ({ child, needs }: { child: any; needs: Need[] }) => {
  const NEED_CATEGORIES = {
    education: "Éducation",
    jouet: "Jouet",
    vetement: "Vêtement",
    nourriture: "Nourriture",
    medicament: "Médicament",
    hygiene: "Hygiène",
    autre: "Autre"
  };

  return (
    <Card key={child.id} className="p-4">
      <h3 className="font-semibold text-lg mb-4">{child.name}</h3>
      <div className="space-y-4">
        {needs?.map((need: Need, index: number) => (
          <div 
            key={`${need.category}-${index}`}
            className={`p-3 rounded-lg border ${
              need.is_urgent ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
            }`}
          >
            <div className="space-y-2">
              <div className="font-medium">
                {NEED_CATEGORIES[need.category as keyof typeof NEED_CATEGORIES]}
              </div>
              <div className="text-sm text-gray-600">{need.description}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export const ChildrenNeeds = ({ children, isLoading, onNeedsUpdate }: { 
  children: any[];
  isLoading: boolean;
  onNeedsUpdate: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false);
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
          <ChildNeeds key={child.id} child={child} needs={child.needs || []} />
        ))}
      </div>
    </div>
  );
};