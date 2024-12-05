import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@supabase/auth-helpers-react";

const Travels = () => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(new Date());
  const [wantsToVisitChild, setWantsToVisitChild] = useState(false);
  const [wantsDonationPickup, setWantsDonationPickup] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t } = useLanguage();
  const user = useAuth();

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
              name
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
    if (!validateDates()) return;

    try {
      const { error } = await supabase
        .from('sponsors')
        .update({
          wants_to_visit_child: wantsToVisitChild,
          wants_donation_pickup: wantsDonationPickup,
          visit_start_date: selectedStartDate,
          visit_end_date: selectedEndDate
        })
        .eq('id', user?.id);

      if (error) throw error;

      // Create notification for assistants
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          type: 'new_visit_request',
          title: t("newVisitRequest"),
          content: t("newVisitRequestContent"),
          recipient_role: 'assistant'
        });

      if (notifError) throw notifError;

      toast.success(t("visitRequestSubmitted"));
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating visit preferences:', error);
      toast.error(t("error"));
    }
  };

  const isAssistant = user?.user_metadata?.role === 'assistant';

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">{t("travelManagement")}</h1>
      
      {isAssistant ? (
        // Vue pour les assistants
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">{t("scheduledVisits")}</h2>
          <div className="space-y-4">
            {travels?.map((travel) => (
              <div key={travel.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {travel.sponsorships?.sponsors?.name} → {travel.sponsorships?.children?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t("startDate")}: {new Date(travel.visit_start_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t("endDate")}: {new Date(travel.visit_end_date).toLocaleDateString()}
                    </p>
                    <div className="mt-2 space-y-1">
                      {travel.wants_to_visit_child && (
                        <p className="text-sm text-blue-600">{t("wantsToVisitChild")}</p>
                      )}
                      {travel.wants_donation_pickup && (
                        <p className="text-sm text-green-600">{t("wantsDonationPickup")}</p>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    travel.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    travel.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {travel.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        // Vue pour les parrains
        <>
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">{t("scheduleNewVisit")}</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>{t("scheduleVisit")}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("scheduleNewVisit")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t("startDate")}</label>
                    <Calendar
                      mode="single"
                      selected={selectedStartDate}
                      onSelect={setSelectedStartDate}
                      className="rounded-md border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t("endDate")}</label>
                    <Calendar
                      mode="single"
                      selected={selectedEndDate}
                      onSelect={setSelectedEndDate}
                      className="rounded-md border"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="visitChild"
                      checked={wantsToVisitChild}
                      onCheckedChange={(checked) => setWantsToVisitChild(checked as boolean)}
                    />
                    <label htmlFor="visitChild" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {t("visitChild")}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="meetAssistant"
                      checked={wantsDonationPickup}
                      onCheckedChange={(checked) => setWantsDonationPickup(checked as boolean)}
                    />
                    <label htmlFor="meetAssistant" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {t("meetAssistant")}
                    </label>
                  </div>
                  <Button onClick={handleSubmit} className="w-full">
                    {t("submitVisit")}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">{t("upcomingVisits")}</h2>
            <div className="space-y-4">
              {travels?.map((travel) => (
                <div key={travel.id} className="p-4 border rounded-lg">
                  <p className="font-medium">
                    {travel.sponsorships?.sponsors?.name} → {travel.sponsorships?.children?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("date")}: {new Date(travel.visit_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("status")}: {travel.status}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default Travels;