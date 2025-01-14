import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  onStatusChange
}: TemporaryStatusDialogProps) => {
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!endDate) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('sponsorships')
        .update({
          is_temporary: true,
          end_planned_date: endDate.toISOString()
        })
        .eq('id', sponsorshipId);

      if (error) throw error;

      toast.success("Statut temporaire défini avec succès");
      onStatusChange();
      onClose();
    } catch (error) {
      console.error('Error setting temporary status:', error);
      toast.error("Erreur lors de la définition du statut temporaire");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Définir un parrainage temporaire</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !endDate}
            className="w-full"
          >
            {isSubmitting ? 'Enregistrement...' : 'Confirmer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};