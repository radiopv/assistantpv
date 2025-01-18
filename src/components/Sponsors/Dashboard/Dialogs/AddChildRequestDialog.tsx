import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AddChildRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (childName: string, notes?: string) => Promise<void>;
  isLoading: boolean;
}

export const AddChildRequestDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}: AddChildRequestDialogProps) => {
  const [childName, setChildName] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(childName, notes);
    setChildName("");
    setNotes("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Demande d'ajout d'enfant</DialogTitle>
          <DialogDescription>
            Veuillez fournir les informations sur l'enfant que vous souhaitez ajouter à votre parrainage.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="childName">Nom de l'enfant</Label>
            <Input
              id="childName"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Nom de l'enfant"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Informations supplémentaires</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez des détails qui pourraient nous aider à identifier l'enfant"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Envoi..." : "Envoyer la demande"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};