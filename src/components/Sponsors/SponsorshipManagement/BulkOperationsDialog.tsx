import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BulkOperationsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSponsors: string[];
  onOperationComplete: () => void;
}

export const BulkOperationsDialog = ({
  isOpen,
  onClose,
  selectedSponsors,
  onOperationComplete,
}: BulkOperationsDialogProps) => {
  const [operation, setOperation] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!operation) return;

    try {
      const updates = selectedSponsors.map((sponsorId) => ({
        id: sponsorId,
        is_active: operation === "deactivate" ? false : true,
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase.from("sponsors").upsert(updates);

      if (error) throw error;

      // Log the operation
      const { error: logError } = await supabase.from("activity_logs").insert(
        selectedSponsors.map((sponsorId) => ({
          user_id: sponsorId,
          action: operation,
          details: {
            reason,
            performed_by: (supabase.auth.getUser()).data.user?.id,
          },
        }))
      );

      if (logError) throw logError;

      toast.success("Opération effectuée avec succès");
      onOperationComplete();
      onClose();
    } catch (error) {
      console.error("Error performing bulk operation:", error);
      toast.error("Erreur lors de l'opération");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Opérations en masse</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Opération</Label>
            <Select value={operation} onValueChange={setOperation}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une opération" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deactivate">Désactiver les comptes</SelectItem>
                <SelectItem value="activate">Activer les comptes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Raison</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Raison de l'opération..."
              required
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