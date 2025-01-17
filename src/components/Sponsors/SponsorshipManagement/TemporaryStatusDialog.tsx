import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TemporaryStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sponsorshipId: string;
  onStatusChange: () => void;
}

export const TemporaryStatusDialog = ({
  isOpen,
  onClose,
  sponsorshipId,
  onStatusChange,
}: TemporaryStatusDialogProps) => {
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!endDate) return;

    try {
      const { error } = await supabase
        .from("sponsorships")
        .update({
          is_temporary: true,
          end_planned_date: endDate,
          updated_at: new Date().toISOString(),
        })
        .eq("id", sponsorshipId);

      if (error) throw error;

      const { error: historyError } = await supabase.from("sponsorship_history").insert([
        {
          sponsorship_id: sponsorshipId,
          action: "temporary_status_set",
          reason: reason || "Statut temporaire défini",
          performed_by: (await supabase.auth.getUser()).data.user?.id,
        },
      ]);

      if (historyError) throw historyError;

      toast.success("Statut temporaire défini avec succès");
      onStatusChange();
      onClose();
    } catch (error) {
      console.error("Error setting temporary status:", error);
      toast.error("Erreur lors de la définition du statut temporaire");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Définir un statut temporaire</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Date de fin prévue</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div>
            <Label>Raison (optionnelle)</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Raison du statut temporaire..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">Confirmer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};