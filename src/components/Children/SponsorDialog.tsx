import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { Children } from "@/integrations/supabase/types/children";

interface SponsorDialogProps {
  child: Children['Row'];
  sponsors: any[];
  isOpen: boolean;
  onClose: () => void;
}

export const SponsorDialog = ({ child, sponsors, isOpen, onClose }: SponsorDialogProps) => {
  const [selectedSponsor, setSelectedSponsor] = useState<string>(child.sponsor_id?.toString() || "none");
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const handleSponsorUpdate = async (childId: string, sponsorId: string) => {
    try {
      console.log('Updating sponsor with:', { childId, sponsorId });
      
      const updateData = {
        is_sponsored: sponsorId !== "none",
        sponsor_id: sponsorId === "none" ? null : Number(sponsorId),
        sponsor_name: sponsors?.find(s => s.id === sponsorId)?.name || null,
        sponsor_email: sponsors?.find(s => s.id === sponsorId)?.email || null,
      };

      console.log('Update data:', updateData);

      const { error } = await supabase
        .from('children')
        .update(updateData)
        .eq('id', childId);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast.success(t("sponsorUpdateSuccess"));
      queryClient.invalidateQueries({ queryKey: ['children'] });
      onClose();
    } catch (error) {
      console.error('Error updating sponsor:', error);
      toast.error(t("sponsorUpdateError"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("selectSponsor")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Select
            value={selectedSponsor}
            onValueChange={setSelectedSponsor}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectSponsorPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                {t("noSponsor")}
              </SelectItem>
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
            <Button onClick={() => handleSponsorUpdate(child.id, selectedSponsor)}>
              {t("save")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};