import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface SponsorshipHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sponsorshipId: string;
}

interface HistoryEntry {
  id: string;
  action: string;
  created_at: string;
  reason?: string;
  performed_by: {
    name: string;
  };
}

export const SponsorshipHistoryDialog = ({
  isOpen,
  onClose,
  sponsorshipId
}: SponsorshipHistoryDialogProps) => {
  const { data: history } = useQuery({
    queryKey: ['sponsorship-history', sponsorshipId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsorship_history')
        .select(`
          id,
          action,
          created_at,
          reason,
          performed_by (
            name
          )
        `)
        .eq('sponsorship_id', sponsorshipId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as HistoryEntry[];
    },
    enabled: isOpen && !!sponsorshipId
  });

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'created':
        return 'Création';
      case 'transferred':
        return 'Transfert';
      case 'paused':
        return 'Mise en pause';
      case 'resumed':
        return 'Reprise';
      case 'ended':
        return 'Fin';
      default:
        return action;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Historique du parrainage</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {history?.map((entry) => (
            <div key={entry.id} className="border-l-2 border-gray-200 pl-4 py-2">
              <div className="text-sm font-medium">
                {getActionLabel(entry.action)}
              </div>
              <div className="text-xs text-gray-500">
                {format(new Date(entry.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
              </div>
              {entry.reason && (
                <div className="text-sm text-gray-600 mt-1">
                  Raison : {entry.reason}
                </div>
              )}
              <div className="text-xs text-gray-500 mt-1">
                Par : {entry.performed_by.name}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};