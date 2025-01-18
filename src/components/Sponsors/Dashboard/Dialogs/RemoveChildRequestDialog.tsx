import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface RemoveChildRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (notes?: string) => Promise<void>;
  isLoading: boolean;
  childName: string;
}

export const RemoveChildRequestDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  childName
}: RemoveChildRequestDialogProps) => {
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(notes);
    setNotes("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Demande de retrait d'enfant</DialogTitle>
          <DialogDescription>
            Vous êtes sur le point de demander le retrait de {childName} de votre parrainage.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Raison de la demande (optionnel)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Expliquez la raison de votre demande"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" variant="destructive" disabled={isLoading}>
              {isLoading ? "Envoi..." : "Confirmer la demande"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};