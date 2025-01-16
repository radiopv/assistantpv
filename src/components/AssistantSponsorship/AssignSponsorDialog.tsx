import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SponsorsList } from "./SponsorsList";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";

interface AssignSponsorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  childId: string;
  onAssignComplete?: () => void;
}

export const AssignSponsorDialog = ({
  isOpen,
  onClose,
  childId,
  onAssignComplete
}: AssignSponsorDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useLanguage();

  const { data: sponsors = [] } = useQuery({
    queryKey: ['sponsors-for-assignment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching sponsors:', error);
        throw error;
      }
      return data || [];
    }
  });

  const handleSelectSponsor = async (sponsorId: string) => {
    try {
      const { error } = await supabase
        .from('child_assignment_requests')
        .insert({
          sponsor_id: sponsorId,
          child_id: childId,
          status: 'pending'
        });

      if (error) throw error;

      toast.success(t("sponsorshipRequestCreated"));
      onAssignComplete?.();
      onClose();
    } catch (error) {
      console.error('Error assigning sponsor:', error);
      toast.error(t("errorAssigningSponsor"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("assignSponsor")}</DialogTitle>
        </DialogHeader>
        <SponsorsList
          sponsors={sponsors}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSelectSponsor={handleSelectSponsor}
        />
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};