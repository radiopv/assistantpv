import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Need } from "@/types/needs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface NeedsSelectionFieldProps {
  childId?: string;
  selectedNeeds: Need[];
  onNeedsChange: (needs: Need[]) => void;
  translations: Record<string, string>;
}

export const NeedsSelectionField = ({
  childId,
  selectedNeeds,
  onNeedsChange,
  translations,
}: NeedsSelectionFieldProps) => {
  const [needs, setNeeds] = useState<Need[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchNeeds = async () => {
      const { data, error } = await supabase
        .from("need_categories")
        .select("*");

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

  const handleNeedSelect = async (value: string) => {
    try {
      const selectedNeed = needs.find(need => need.id === value);
      if (!selectedNeed) return;

      const updatedNeeds = [...selectedNeeds, selectedNeed];

      if (!childId) {
        onNeedsChange(updatedNeeds);
        return;
      }

      const { error: updateError } = await supabase
        .from('children')
        .update({ needs: updatedNeeds })
        .eq('id', childId);

      if (updateError) throw updateError;

      if (childId) {
        const { error: notifError } = await supabase
          .from('notifications')
          .insert({
            recipient_id: childId,
            type: 'needs_update',
            title: translations.needsUpdateTitle || 'Mise à jour des besoins',
            content: translations.needsUpdateContent || 'Les besoins ont été mis à jour',
            link: `/children/${childId}`,
            metadata: {
              child_id: childId,
              need_type: selectedNeed.category
            }
          });

        if (notifError) {
          console.error("Error creating notification:", notifError);
        }
      }

      onNeedsChange(updatedNeeds);
    } catch (error) {
      console.error("Error updating needs:", error);
      toast({
        title: t("error"),
        description: t("errorUpdatingNeeds"),
        variant: "destructive",
      });
    }
  };

  return (
    <Select
      value={selectedNeeds[0]?.id || ""}
      onValueChange={handleNeedSelect}
    >
      <SelectTrigger>
        <SelectValue placeholder={translations.selectNeeds || "Sélectionner les besoins"} />
      </SelectTrigger>
      <SelectContent>
        {needs.map((need) => (
          <SelectItem key={need.id} value={need.id || ""}>
            {need.category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};