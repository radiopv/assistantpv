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

      setNeeds(data || []);
    };

    fetchNeeds();
  }, []);

  const handleNeedsChange = async (newNeeds: Need[]) => {
    try {
      if (!childId) {
        onNeedsChange(newNeeds);
        return;
      }

      const { error: updateError } = await supabase
        .from('children')
        .update({ needs: newNeeds })
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
            link: `/children/${childId}`
          });

        if (notifError) {
          console.error("Error creating notification:", notifError);
        }
      }

      const { error: auditError } = await supabase
        .from('children_audit_logs')
        .insert({
          child_id: childId,
          action: 'needs_updated',
          changes: {
            needs: newNeeds
          }
        });

      if (auditError) {
        console.error("Error creating audit log:", auditError);
      }

      onNeedsChange(newNeeds);
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
      value={selectedNeeds}
      onValueChange={(value) => {
        handleNeedsChange(value as unknown as Need[]);
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder={translations.selectNeeds || "Sélectionner les besoins"} />
      </SelectTrigger>
      <SelectContent>
        {needs.map((need) => (
          <SelectItem key={need.id} value={need.id}>
            {need.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};