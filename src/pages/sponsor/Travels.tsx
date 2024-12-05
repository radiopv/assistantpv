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

const Travels = () => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(new Date());
  const [wantsToVisitChild, setWantsToVisitChild] = useState(false);
  const [wantsDonationPickup, setWantsDonationPickup] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t } = useLanguage();

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

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from('sponsors')
        .update({
          wants_to_visit_child: wantsToVisitChild,
          wants_donation_pickup: wantsDonationPickup,
          visit_start_date: selectedStartDate,
          visit_end_date: selectedEndDate
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast.success(t("dateSelected"));
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating visit preferences:', error);
      toast.error(t("error"));
    }
  };

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">{t("travelManagement")}</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">{t("visitCalendar")}</h2>
          <Calendar
            mode="single"
            selected={selectedStartDate}
            onSelect={setSelectedStartDate}
            className="rounded-md border"
          />
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
      </div>

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
    </div>
  );
};

export default Travels;