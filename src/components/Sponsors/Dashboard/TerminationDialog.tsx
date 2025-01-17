import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface TerminationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sponsorshipId: string;
  childName: string;
  onTerminationComplete: () => void;
}

export const TerminationDialog = ({
  isOpen,
  onClose,
  sponsorshipId,
  childName,
  onTerminationComplete
}: TerminationDialogProps) => {
  const [date, setDate] = useState<Date>();
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async () => {
    if (!date) {
      toast.error(t("selectEndDate"));
      return;
    }

    if (!reason.trim()) {
      toast.error(t("provideReason"));
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase.rpc('terminate_sponsorship', {
        p_sponsorship_id: sponsorshipId,
        p_termination_date: date.toISOString().split('T')[0],
        p_termination_reason: reason,
        p_termination_comment: reason,
        p_performed_by: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) throw error;

      toast.success(t("sponsorshipTerminated"));
      onTerminationComplete();
      onClose();
    } catch (error) {
      console.error('Error terminating sponsorship:', error);
      toast.error(t("errorTerminatingSponsorship"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("endSponsorship")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {t("endingSponsorshipFor")} {childName}
          </p>
          <div className="flex flex-col items-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("terminationReason")}
            className="min-h-[100px]"
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              variant="destructive"
            >
              {isSubmitting ? t("processing") : t("confirmTermination")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};