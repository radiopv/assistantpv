import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface SponsorshipHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sponsorshipId: string;
}

interface HistoryEntry {
  id: string;
  action: string;
  reason: string;
  created_at: string;
  performed_by: {
    name: string;
  };
}

export const SponsorshipHistoryDialog = ({
  isOpen,
  onClose,
  sponsorshipId
}: SponsorshipHistoryDialogProps) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!isOpen) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('sponsorship_history')
          .select(`
            *,
            performed_by:sponsors(name)
          `)
          .eq('sponsorship_id', sponsorshipId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setHistory(data);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [sponsorshipId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Historique du parrainage</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <p>Chargement...</p>
          ) : history.length === 0 ? (
            <p>Aucun historique disponible</p>
          ) : (
            history.map((entry) => (
              <div key={entry.id} className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {entry.action === 'transferred' && 'Transfert'}
                      {entry.action === 'pause' && 'Mise en pause'}
                      {entry.action === 'resume' && 'Reprise'}
                    </p>
                    {entry.reason && (
                      <p className="text-sm text-gray-600">{entry.reason}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {format(new Date(entry.created_at), 'dd/MM/yyyy HH:mm')}
                    </p>
                    <p className="text-xs text-gray-400">
                      par {entry.performed_by?.name || 'Système'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};