import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useLanguage } from "@/contexts/LanguageContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/components/Auth/AuthProvider";
import { toast } from "sonner";

const Travels = () => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(new Date());
  const [wantsToVisitChild, setWantsToVisitChild] = useState(false);
  const [wantsDonationPickup, setWantsDonationPickup] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t } = useLanguage();
  const { user } = useAuth();

  const { data: travels, isLoading } = useQuery({
    queryKey: ['travels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scheduled_visits')
        .select(`
          *,
          sponsorships (
            sponsors (
              name,
              email
            ),
            children (
              name,
              city
            )
          )
        `)
        .order('visit_date', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

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
    if (!validateDates() || !user) return;

    try {
      const { error } = await supabase
        .from('sponsors')
        .update({
          wants_to_visit_child: wantsToVisitChild,
          wants_donation_pickup: wantsDonationPickup,
          visit_start_date: selectedStartDate.toISOString(),
          visit_end_date: selectedEndDate.toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Create notification for assistants
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

  const isAssistant = user?.role === 'assistant';

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  return (
    <div className="space-y-6">
      {isAssistant ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">{t("scheduledVisits")}</h2>
          <div className="space-y-4">
            {travels?.map((visit) => (
              <div key={visit.id} className="bg-white p-4 rounded-lg shadow">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">
                      {visit.sponsorships.sponsors.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {visit.sponsorships.sponsors.email}
                    </p>
                  </div>
                  <div>
                    <p>
                      {new Date(visit.visit_start_date).toLocaleDateString()} - {new Date(visit.visit_end_date).toLocaleDateString()}
                    </p>
                    {visit.wants_to_visit_child && (
                      <p className="text-sm text-blue-600">
                        {t("wantsToVisitChild")}
                      </p>
                    )}
                    {visit.wants_donation_pickup && (
                      <p className="text-sm text-green-600">
                        {t("wantsDonationPickup")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
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
        </div>
      )}
    </div>
  );
};

export default Travels;