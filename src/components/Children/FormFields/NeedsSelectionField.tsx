import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Need } from "@/types/needs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NeedsSelectionFieldProps {
  childId?: string;
  selectedNeeds: Need[];
  onNeedsChange: (needs: Need[]) => void;
  translations: any;
}

export const NeedsSelectionField = ({ childId, selectedNeeds = [], onNeedsChange, translations }: NeedsSelectionFieldProps) => {
  const [needs, setNeeds] = useState<Need[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNeeds = async () => {
      const { data, error } = await supabase
        .from('need_categories')
        .select('*');

      if (error) {
        console.error("Error fetching needs:", error);
        return;
      }

      const formattedNeeds: Need[] = (data || []).map(item => ({
        id: item.id,
        category: item.name,
        description: item.description || '',
        is_urgent: false
      }));

      setNeeds(formattedNeeds);
    };

    fetchNeeds();
  }, []);

  const handleNeedsChange = async (selectedIds: string[]) => {
    try {
      const selectedNeedsList = needs.filter(need => selectedIds.includes(need.id || ''));

      if (!childId) {
        onNeedsChange(selectedNeedsList);
        return;
      }

      const { error: updateError } = await supabase
        .from('children')
        .update({ needs: selectedNeedsList })
        .eq('id', childId);

      if (updateError) throw updateError;

      const { data: sponsorship } = await supabase
        .from('sponsorships')
        .select('sponsor_id, children (name)')
        .eq('child_id', childId)
        .eq('status', 'active')
        .single();

      if (sponsorship?.sponsor_id) {
        const { error: notifError } = await supabase
          .from('notifications')
          .insert({
            recipient_id: sponsorship.sponsor_id,
            type: 'needs_update',
            title: translations.needsUpdateTitle || 'Mise à jour des besoins',
            content: translations.needsUpdateContent || 'Les besoins ont été mis à jour',
            link: `/children/${childId}`,
            metadata: {
              child_id: childId,
              child_name: sponsorship.children?.name
            }
          });

        if (notifError) {
          console.error("Error creating notification:", notifError);
        }
      }

      onNeedsChange(selectedNeedsList);
    } catch (error) {
      console.error("Error updating needs:", error);
      toast({
        variant: "destructive",
        title: translations.error || "Erreur",
        description: translations.errorUpdatingNeeds || "Une erreur est survenue lors de la mise à jour des besoins"
      });
    }
  };

  return (
    <Select
      value={selectedNeeds.map(need => need.id).filter(Boolean) as string[]}
      onValueChange={handleNeedsChange}
    >
      <SelectTrigger>
        <SelectValue placeholder={translations.selectNeeds || "Sélectionner les besoins"} />
      </SelectTrigger>
      <SelectContent>
        {needs.map((need) => (
          <SelectItem key={need.id} value={need.id || ''}>
            {need.category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};