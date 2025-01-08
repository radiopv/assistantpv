import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";

interface SponsorshipAssociationDialogProps {
  child: any;
  sponsors: any[];
  isOpen: boolean;
  onClose: () => void;
}

export const SponsorshipAssociationDialog = ({ 
  child, 
  sponsors, 
  isOpen, 
  onClose 
}: SponsorshipAssociationDialogProps) => {
  const [selectedSponsor, setSelectedSponsor] = useState<string>("");
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const handleAssociation = async () => {
    try {
      // Check if child is already sponsored
      const { data: existingSponsorship, error: checkError } = await supabase
        .from('sponsorships')
        .select('id')
        .eq('child_id', child.id)
        .eq('status', 'active')
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingSponsorship) {
        toast.error(t("childAlreadySponsored"));
        return;
      }

      // Create new sponsorship
      const { error } = await supabase
        .from('sponsorships')
        .insert({
          sponsor_id: selectedSponsor,
          child_id: child.id,
          status: 'active',
          start_date: new Date().toISOString()
        });

      if (error) throw error;

      // Update child status
      const { error: updateError } = await supabase
        .from('children')
        .update({ 
          is_sponsored: true,
          sponsor_id: selectedSponsor,
          sponsor_name: sponsors.find(s => s.id === selectedSponsor)?.name
        })
        .eq('id', child.id);

      if (updateError) throw updateError;

      toast.success(t("sponsorshipCreated"));
      queryClient.invalidateQueries({ queryKey: ['children'] });
      queryClient.invalidateQueries({ queryKey: ['sponsors'] });
      onClose();
    } catch (error) {
      console.error('Error creating sponsorship:', error);
      toast.error(t("errorCreatingSponsorship"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("associateSponsor")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Select
            value={selectedSponsor}
            onValueChange={setSelectedSponsor}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectSponsor")} />
            </SelectTrigger>
            <SelectContent>
              {sponsors.map((sponsor) => (
                <SelectItem key={sponsor.id} value={sponsor.id}>
                  {sponsor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button 
              onClick={handleAssociation}
              disabled={!selectedSponsor}
            >
              {t("associate")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};