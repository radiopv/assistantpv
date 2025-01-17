import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
    if (!endDate || !reason) return;

    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user?.id) {
        throw new Error("Utilisateur non authentifié");
      }

      const { error } = await supabase.rpc("handle_sponsorship_pause", {
        sponsorship_id: sponsorshipId,
        action: "pause",
        reason: reason,
        performed_by: user.user.id
      });

      if (error) throw error;

      toast.success("Statut temporaire appliqué avec succès");
      onStatusChange();
      onClose();
    } catch (error) {
      console.error("Error setting temporary status:", error);
      toast.error("Erreur lors de l'application du statut temporaire");
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
            <Label>Date de fin</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Raison</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Raison du changement de statut..."
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