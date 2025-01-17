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

export const SponsorshipHistoryDialog = ({ isOpen, onClose, sponsorshipId }: SponsorshipHistoryDialogProps) => {
  const { data: history, isLoading } = useQuery({
    queryKey: ["sponsorship-history", sponsorshipId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsorship_history")
        .select("*")
        .eq("sponsorship_id", sponsorshipId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: isOpen && !!sponsorshipId,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Historique du parrainage</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {isLoading ? (
            <p>Chargement...</p>
          ) : history?.length === 0 ? (
            <p>Aucun historique disponible</p>
          ) : (
            history?.map((entry) => (
              <div key={entry.id} className="border-b pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{entry.action}</p>
                    {entry.reason && <p className="text-sm text-gray-600">{entry.reason}</p>}
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(new Date(entry.created_at), "dd MMMM yyyy", { locale: fr })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};