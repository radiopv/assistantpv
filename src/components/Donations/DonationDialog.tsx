import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface DonationDialogProps {
  open: boolean;
  onClose: () => void;
  donation: {
    id: string;
    assistant_name: string;
    city: string;
    people_helped: number;
    comments: string | null;
  };
  onSave: (donation: any) => void;
}

export const DonationDialog = ({ open, onClose, donation, onSave }: DonationDialogProps) => {
  const [editedDonation, setEditedDonation] = React.useState(donation);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le don</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              value={editedDonation.city}
              onChange={(e) => setEditedDonation({...editedDonation, city: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="people_helped">Personnes aidées</Label>
            <Input
              id="people_helped"
              type="number"
              value={editedDonation.people_helped}
              onChange={(e) => setEditedDonation({...editedDonation, people_helped: parseInt(e.target.value)})}
            />
          </div>
          <div>
            <Label htmlFor="assistant_name">Assistant</Label>
            <Input
              id="assistant_name"
              value={editedDonation.assistant_name}
              onChange={(e) => setEditedDonation({...editedDonation, assistant_name: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="comments">Commentaires</Label>
            <Textarea
              id="comments"
              value={editedDonation.comments || ''}
              onChange={(e) => setEditedDonation({...editedDonation, comments: e.target.value})}
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