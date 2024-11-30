import { useState } from "react";
import { Need } from "@/types/needs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { convertNeedsToJson } from "@/types/needs";
import { Skeleton } from "@/components/ui/skeleton";
import { NeedForm } from "./NeedForm";
import { NeedsList } from "./NeedsList";
import { NeedsStats } from "./NeedsStats";
import { ChildrenFilter } from "./ChildrenFilter";
import { NeedsHeader } from "./NeedsHeader";
import { translations } from "./translations";

export const ChildrenNeeds = ({ children, isLoading, onNeedsUpdate }: { 
  children: any[];
  isLoading: boolean;
  onNeedsUpdate: () => void;
}) => {
  const [language, setLanguage] = useState<"fr" | "es">("fr");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<any | null>(null);
  const [selectedNeeds, setSelectedNeeds] = useState<Need[]>([]);
  const [filters, setFilters] = useState({
    category: "",
    urgentOnly: false,
    searchTerm: ""
  });

  const t = translations[language];

  const handleAddNeeds = async () => {
    if (!selectedChild) return;

    try {
      const updatedNeeds = [...(selectedChild.needs || []), ...selectedNeeds];
      const { error } = await supabase
        .from('children')
        .update({ needs: convertNeedsToJson(updatedNeeds) })
        .eq('id', selectedChild.id);

      if (error) throw error;

      toast.success(language === "fr" ? "Besoins ajoutés avec succès" : "Necesidades agregadas con éxito");
      setSelectedNeeds([]);
      setSelectedChild(null);
      setIsOpen(false);
      onNeedsUpdate();
    } catch (error) {
      toast.error(language === "fr" ? "Erreur lors de l'ajout des besoins" : "Error al agregar las necesidades");
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
      <NeedsHeader 
        language={language}
        setLanguage={setLanguage}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <NeedsStats children={children} />
      
      <ChildrenFilter 
        filters={filters} 
        setFilters={setFilters}
        language={language}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {filteredChildren.map((child) => (
          <NeedsList 
            key={child.id} 
            child={child} 
            needs={child.needs || []}
            language={language}
          />
        ))}
      </div>

      {filteredChildren.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {t.noNeeds}
        </div>
      )}

      {isOpen && (
        <NeedForm
          selectedNeeds={selectedNeeds}
          setSelectedNeeds={setSelectedNeeds}
          onSubmit={handleAddNeeds}
          language={language}
        />
      )}
    </div>
  );
};