import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DonationBasicInfo } from "./DonationBasicInfo";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <DialogContent className="max-w-2xl w-full max-h-[90vh] flex flex-col">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-semibold">Modifier le don</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-1">
          <div className="space-y-6 py-4">
            <div className="grid gap-6 md:grid-cols-2">
              <DonationBasicInfo
                city={editedDonation.city}
                onCityChange={(value) => setEditedDonation({...editedDonation, city: value})}
                quantity={editedDonation.people_helped.toString()}
                onQuantityChange={(value) => setEditedDonation({...editedDonation, people_helped: parseInt(value)})}
                assistantName={editedDonation.assistant_name}
                onAssistantNameChange={(value) => setEditedDonation({...editedDonation, assistant_name: value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comments" className="text-sm font-medium">
                Commentaires
              </Label>
              <Textarea
                id="comments"
                value={editedDonation.comments || ''}
                onChange={(e) => setEditedDonation({...editedDonation, comments: e.target.value})}
                className="min-h-[120px] text-base resize-none"
                placeholder="Ajoutez des commentaires sur ce don..."
              />
            </div>
          </div>
        </ScrollArea>

        <div className="border-t pt-4 mt-4 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>Annuler</span>
          </Button>
          <Button
            onClick={() => onSave(editedDonation)}
            className="flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Enregistrer</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};