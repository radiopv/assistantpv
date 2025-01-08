import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SponsorshipAssociationDialogProps {
  sponsorId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SponsorshipAssociationDialog = ({
  sponsorId,
  isOpen,
  onClose
}: SponsorshipAssociationDialogProps) => {
  const [childId, setChildId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('sponsorships')
        .insert({
          sponsor_id: sponsorId,
          child_id: childId
        });

      if (error) throw error;

      toast.success("Enfant associé avec succès");
      setChildId("");
      onClose();
    } catch (error) {
      console.error('Error associating child:', error);
      toast.error("Erreur lors de l'association de l'enfant");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Associer un enfant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="ID de l'enfant"
            value={childId}
            onChange={(e) => setChildId(e.target.value)}
            required
          />
          <Button type="submit">Associer</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
