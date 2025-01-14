import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  onOperationComplete
}: BulkOperationsDialogProps) => {
  const [loading, setLoading] = useState(false);

  const handleBulkPause = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.rpc('handle_sponsorship_pause', {
        sponsorship_id: selectedSponsors[0],
        action: 'pause',
        reason: 'Pause en masse',
        performed_by: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) throw error;
      
      toast.success("Parrainages mis en pause");
      onOperationComplete();
      onClose();
    } catch (error) {
      console.error('Error pausing sponsorships:', error);
      toast.error("Erreur lors de la mise en pause");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkResume = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.rpc('handle_sponsorship_pause', {
        sponsorship_id: selectedSponsors[0],
        action: 'resume',
        reason: 'Reprise en masse',
        performed_by: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) throw error;
      
      toast.success("Parrainages repris");
      onOperationComplete();
      onClose();
    } catch (error) {
      console.error('Error resuming sponsorships:', error);
      toast.error("Erreur lors de la reprise");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actions en masse</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Button
            onClick={handleBulkPause}
            disabled={loading}
            className="w-full"
          >
            Mettre en pause tous les parrainages sélectionnés
          </Button>
          <Button
            onClick={handleBulkResume}
            disabled={loading}
            className="w-full"
          >
            Reprendre tous les parrainages sélectionnés
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};