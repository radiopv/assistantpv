import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BulkOperationsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSponsors: string[];
  selectedChildren: string[];
  onOperationComplete: () => void;
}

export const BulkOperationsDialog = ({
  isOpen,
  onClose,
  selectedSponsors,
  selectedChildren,
  onOperationComplete
}: BulkOperationsDialogProps) => {
  const [operation, setOperation] = useState<'pause' | 'resume' | 'transfer' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBulkOperation = async () => {
    if (!operation) return;
    
    setIsProcessing(true);
    try {
      switch (operation) {
        case 'pause':
          await supabase.rpc('handle_sponsorship_pause', {
            sponsorship_ids: selectedSponsors,
            action: 'pause',
            reason: 'Bulk operation',
            performed_by: (await supabase.auth.getUser()).data.user?.id
          });
          break;
        case 'resume':
          await supabase.rpc('handle_sponsorship_pause', {
            sponsorship_ids: selectedSponsors,
            action: 'resume',
            reason: 'Bulk operation',
            performed_by: (await supabase.auth.getUser()).data.user?.id
          });
          break;
      }
      
      toast.success("Opération en masse effectuée avec succès");
      onOperationComplete();
      onClose();
    } catch (error) {
      console.error('Error performing bulk operation:', error);
      toast.error("Erreur lors de l'opération en masse");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Opérations en masse</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={() => setOperation('pause')}
              disabled={isProcessing}
              className={operation === 'pause' ? 'bg-primary/10' : ''}
            >
              Mettre en pause les parrainages sélectionnés
            </Button>
            <Button
              variant="outline"
              onClick={() => setOperation('resume')}
              disabled={isProcessing}
              className={operation === 'resume' ? 'bg-primary/10' : ''}
            >
              Reprendre les parrainages sélectionnés
            </Button>
          </div>
          <Button 
            onClick={handleBulkOperation}
            disabled={!operation || isProcessing}
            className="w-full"
          >
            {isProcessing ? 'En cours...' : 'Appliquer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};