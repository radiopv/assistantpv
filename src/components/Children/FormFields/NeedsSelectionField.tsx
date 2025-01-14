import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Select } from "@/components/ui/select";

interface NeedsSelectionFieldProps {
  childId: string;
  onChange: (needs: any[]) => void;
}

export const NeedsSelectionField = ({ childId, onChange }: NeedsSelectionFieldProps) => {
  const [needs, setNeeds] = useState<any[]>([]);
  const [selectedNeeds, setSelectedNeeds] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNeeds = async () => {
      const { data, error } = await supabase
        .from('needs')
        .select('*');

      if (error) {
        console.error("Error fetching needs:", error);
        return;
      }

      setNeeds(data || []);
    };

    fetchNeeds();
  }, []);

  const handleNeedsChange = async (needs: any[]) => {
    try {
      // Update needs
      const { error: updateError } = await supabase
        .from('children')
        .update({ needs })
        .eq('id', childId);

      if (updateError) throw updateError;

      // Get active sponsor
      const { data: sponsorship } = await supabase
        .from('sponsorships')
        .select('sponsor_id, children (name)')
        .eq('child_id', childId)
        .eq('status', 'active')
        .single();

      if (sponsorship?.sponsor_id) {
        // Create notification for needs update
        const { error: notifError } = await supabase
          .from('notifications')
          .insert({
            recipient_id: sponsorship.sponsor_id,
            type: 'needs_update',
            title: 'Mise à jour des besoins',
            content: `Les besoins de ${sponsorship.children.name} ont été mis à jour`,
            link: `/children/${childId}`
          });

        if (notifError) {
          console.error("Error creating notification:", notifError);
        }
      }

      // Create audit log
      const { error: auditError } = await supabase
        .from('children_audit_logs')
        .insert({
          child_id: childId,
          action: 'needs_updated',
          changes: {
            needs
          }
        });

      if (auditError) {
        console.error("Error creating audit log:", auditError);
      }

      onChange(needs);
    } catch (error) {
      console.error("Error updating needs:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des besoins"
      });
    }
  };

  return (
    <Select
      multiple
      value={selectedNeeds}
      onValueChange={(value) => {
        setSelectedNeeds(value);
        handleNeedsChange(value);
      }}
    >
      {needs.map((need) => (
        <Select.Item key={need.id} value={need.id}>
          {need.name}
        </Select.Item>
      ))}
    </Select>
  );
};
