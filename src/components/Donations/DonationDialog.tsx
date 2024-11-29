import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DonationBasicInfo } from "./DonationBasicInfo";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface DonationDialogProps {
  open: boolean;
  onClose: () => void;
  donation: {
    id: string;
    assistant_name: string;
    city: string;
    people_helped: number;
    comments: string | null;
    status: string;
  };
  onSave: (donation: any) => void;
}

export const DonationDialog = ({ open, onClose, donation, onSave }: DonationDialogProps) => {
  const [editedDonation, setEditedDonation] = useState(donation);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le don</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <DonationBasicInfo
            city={editedDonation.city}
            onCityChange={(value) => setEditedDonation({...editedDonation, city: value})}
            quantity={editedDonation.people_helped.toString()}
            onQuantityChange={(value) => setEditedDonation({...editedDonation, people_helped: parseInt(value)})}
            assistantName={editedDonation.assistant_name}
            onAssistantNameChange={(value) => setEditedDonation({...editedDonation, assistant_name: value})}
          />
          <div>
            <Label htmlFor="comments">Commentaires</Label>
            <Textarea
              id="comments"
              value={editedDonation.comments || ''}
              onChange={(e) => setEditedDonation({...editedDonation, comments: e.target.value})}
              className="min-h-[100px]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={() => onSave(editedDonation)}>
              Enregistrer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};