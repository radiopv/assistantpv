import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface SponsorDialogProps {
  child: any;
  sponsors: any[];
  isOpen: boolean;
  onClose: () => void;
}

export const SponsorDialog = ({ child, sponsors, isOpen, onClose }: SponsorDialogProps) => {
  const [selectedSponsor, setSelectedSponsor] = useState<string>(child.sponsor_id || "");
  const queryClient = useQueryClient();

  const handleSponsorUpdate = async (childId: string, sponsorId: string | null) => {
    try {
      const updates = {
        is_sponsored: !!sponsorId,
        sponsor_name: sponsors?.find(s => s.id === sponsorId)?.name || null,
        sponsor_email: sponsors?.find(s => s.id === sponsorId)?.email || null,
      };

      const { error } = await supabase
        .from('children')
        .update(updates)
        .eq('id', childId);

      if (error) throw error;

      // Invalidate and refetch children data
      await queryClient.invalidateQueries({ queryKey: ['children'] });

      toast.success(sponsorId ? "Parrain ajouté avec succès" : "Parrain retiré avec succès");
      onClose();
    } catch (error) {
      console.error('Error updating sponsor:', error);
      toast.error("Une erreur est survenue lors de la mise à jour du parrain");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {child.is_sponsored ? "Modifier le parrain" : "Ajouter un parrain"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select
            value={selectedSponsor}
            onValueChange={setSelectedSponsor}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un parrain" />
            </SelectTrigger>
            <SelectContent>
              {child.is_sponsored && (
                <SelectItem value="">Retirer le parrain</SelectItem>
              )}
              {sponsors?.map((sponsor) => (
                <SelectItem key={sponsor.id} value={sponsor.id}>
                  {sponsor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              onClick={() => handleSponsorUpdate(child.id, selectedSponsor || null)}
            >
              Confirmer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};