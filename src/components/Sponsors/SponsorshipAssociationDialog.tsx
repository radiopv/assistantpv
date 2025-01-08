import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";

interface SponsorshipAssociationDialogProps {
  sponsor: any;
  isOpen: boolean;
  onClose: () => void;
}

export const SponsorshipAssociationDialog = ({ 
  sponsor, 
  isOpen, 
  onClose 
}: SponsorshipAssociationDialogProps) => {
  const [selectedChild, setSelectedChild] = useState<string>("");
  const [availableChildren, setAvailableChildren] = useState<any[]>([]);
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  // Fetch available children when dialog opens
  const fetchAvailableChildren = async () => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select('id, name')
        .eq('is_sponsored', false);

      if (error) throw error;
      setAvailableChildren(data || []);
    } catch (error) {
      console.error('Error fetching available children:', error);
      toast.error(t("errorFetchingChildren"));
    }
  };

  const handleAssociation = async () => {
    try {
      // Check if child is already sponsored
      const { data: existingSponsorship, error: checkError } = await supabase
        .from('sponsorships')
        .select('id')
        .eq('child_id', selectedChild)
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
          sponsor_id: sponsor.id,
          child_id: selectedChild,
          status: 'active',
          start_date: new Date().toISOString()
        });

      if (error) throw error;

      toast.success(t("sponsorshipCreated"));
      queryClient.invalidateQueries({ queryKey: ['sponsors'] });
      onClose();
    } catch (error) {
      console.error('Error creating sponsorship:', error);
      toast.error(t("errorCreatingSponsorship"));
    }
  };

  // Fetch available children when dialog opens
  useState(() => {
    if (isOpen) {
      fetchAvailableChildren();
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("associateChild")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Select
            value={selectedChild}
            onValueChange={setSelectedChild}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectChild")} />
            </SelectTrigger>
            <SelectContent>
              {availableChildren.map((child) => (
                <SelectItem key={child.id} value={child.id}>
                  {child.name}
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
              disabled={!selectedChild}
            >
              {t("associate")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};