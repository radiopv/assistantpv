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
  const [isAssigning, setIsAssigning] = useState(false);

  const { data: sponsors = [], isLoading: isLoadingSponsors } = useQuery({
    queryKey: ['sponsors-for-assignment'],
    queryFn: async () => {
      console.log('Fetching sponsors for assignment');
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching sponsors:', error);
        throw error;
      }
      console.log('Fetched sponsors:', data);
      return data || [];
    }
  });

  const handleSelectSponsor = async (sponsorId: string) => {
    console.log('Starting sponsor assignment process:', { sponsorId, childId });
    try {
      setIsAssigning(true);

      // First check if there's already a request
      const { data: existingRequests, error: checkError } = await supabase
        .from('child_assignment_requests')
        .select('*')
        .eq('child_id', childId)
        .eq('sponsor_id', sponsorId)
        .eq('status', 'pending');

      if (checkError) {
        console.error('Error checking existing requests:', checkError);
        toast.error(t("errorAssigningSponsor"));
        return;
      }

      console.log('Existing requests:', existingRequests);

      if (existingRequests && existingRequests.length > 0) {
        console.log('Found existing request');
        toast.error(t("requestAlreadyExists"));
        return;
      }

      // Create new request
      console.log('Creating new assignment request');
      const { error: insertError } = await supabase
        .from('child_assignment_requests')
        .insert({
          sponsor_id: sponsorId,
          child_id: childId,
          status: 'pending',
          created_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error creating assignment request:', insertError);
        toast.error(t("errorAssigningSponsor"));
        return;
      }

      // Update child status
      console.log('Updating child status');
      const { error: updateError } = await supabase
        .from('children')
        .update({ 
          status: 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', childId);

      if (updateError) {
        console.error('Error updating child status:', updateError);
        toast.error(t("errorAssigningSponsor"));
        return;
      }

      console.log('Assignment process completed successfully');
      toast.success(t("sponsorshipRequestCreated"));
      onAssignComplete?.();
      onClose();
    } catch (error) {
      console.error('Error in assignment process:', error);
      toast.error(t("errorAssigningSponsor"));
    } finally {
      setIsAssigning(false);
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
          isLoading={isLoadingSponsors || isAssigning}
        />
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose} disabled={isAssigning}>
            {t("cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};