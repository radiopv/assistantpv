import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface VisitSchedulerProps {
  userId: string;
}

export const VisitScheduler = ({ userId }: VisitSchedulerProps) => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(new Date());
  const [wantsToVisitChild, setWantsToVisitChild] = useState(false);
  const [wantsDonationPickup, setWantsDonationPickup] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t } = useLanguage();

  const validateDates = () => {
    if (!selectedStartDate || !selectedEndDate) {
      toast.error(t("selectBothDates"));
      return false;
    }

    if (selectedStartDate > selectedEndDate) {
      toast.error(t("startDateAfterEnd"));
      return false;
    }

    if (selectedStartDate < new Date()) {
      toast.error(t("dateInPast"));
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateDates() || !userId) return;

    try {
      const { error } = await supabase
        .from('sponsors')
        .update({
          wants_to_visit_child: wantsToVisitChild,
          wants_donation_pickup: wantsDonationPickup,
          visit_start_date: selectedStartDate.toISOString(),
          visit_end_date: selectedEndDate.toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          title: t("newVisitRequest"),
          content: t("newVisitRequestContent"),
          type: 'visit_request',
          recipient_role: 'assistant'
        });

      if (notifError) throw notifError;

      toast.success(t("visitRequestSubmitted"));
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error scheduling visit:', error);
      toast.error(t("error"));
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>{t("scheduleVisit")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("scheduleVisit")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("date")}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <Calendar
                mode="single"
                selected={selectedStartDate}
                onSelect={setSelectedStartDate}
                className="rounded-md border"
              />
              <Calendar
                mode="single"
                selected={selectedEndDate}
                onSelect={setSelectedEndDate}
                className="rounded-md border"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="visitChild"
                checked={wantsToVisitChild}
                onCheckedChange={(checked) => setWantsToVisitChild(checked as boolean)}
              />
              <label htmlFor="visitChild">
                {t("visitChild")}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="meetAssistant"
                checked={wantsDonationPickup}
                onCheckedChange={(checked) => setWantsDonationPickup(checked as boolean)}
              />
              <label htmlFor="meetAssistant">
                {t("meetAssistant")}
              </label>
            </div>
          </div>
          <Button onClick={handleSubmit}>
            {t("submitVisit")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};