import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PlannedVisitFormProps {
  sponsorId: string;
  onVisitPlanned: () => void;
}

export const PlannedVisitForm = ({ sponsorId, onVisitPlanned }: PlannedVisitFormProps) => {
  const { language } = useLanguage();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [wantsToVisitChild, setWantsToVisitChild] = useState(false);
  const [wantsDonationPickup, setWantsDonationPickup] = useState(false);

  const translations = {
    fr: {
      planVisit: "Planifier une visite",
      startDate: "Date d'arrivée",
      endDate: "Date de départ",
      hotelName: "Nom de l'hôtel",
      visitChild: "Je souhaite visiter mon filleul",
      donationPickup: "J'ai des dons à remettre",
      submit: "Enregistrer",
      success: "Visite planifiée avec succès",
      error: "Erreur lors de l'enregistrement de la visite",
      vitiaNotFound: "Impossible de notifier l'assistant. La visite a été enregistrée mais l'assistant devra être notifié manuellement."
    },
    es: {
      planVisit: "Planificar una visita",
      startDate: "Fecha de llegada",
      endDate: "Fecha de salida",
      hotelName: "Nombre del hotel",
      visitChild: "Deseo visitar a mi ahijado",
      donationPickup: "Tengo donaciones para entregar",
      submit: "Guardar",
      success: "Visita planificada con éxito",
      error: "Error al registrar la visita",
      vitiaNotFound: "No se pudo notificar al asistente. La visita se registró pero el asistente deberá ser notificado manualmente."
    }
  };

  const t = translations[language as keyof typeof translations];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting planned visit form...");

    try {
      // Create planned visit record
      const { data: visitData, error: visitError } = await supabase
        .from('planned_visits')
        .insert({
          sponsor_id: sponsorId,
          start_date: startDate,
          end_date: endDate,
          hotel_name: hotelName,
          wants_to_visit_child: wantsToVisitChild,
          wants_donation_pickup: wantsDonationPickup
        })
        .select()
        .single();

      if (visitError) throw visitError;

      console.log("Visit planned successfully:", visitData);

      // Get assistant's ID (looking for Vitia's email)
      const { data: assistantData, error: assistantError } = await supabase
        .from('sponsors')
        .select('id')
        .eq('email', 'vitia@passionvaradero.ca')
        .single();

      if (assistantError) {
        console.error("Error finding assistant:", assistantError);
        throw assistantError;
      }

      if (!assistantData) {
        console.warn("Assistant not found in database");
        toast.warning(t.vitiaNotFound);
      } else {
        console.log("Found assistant:", assistantData);

        // Get sponsor info for the notification
        const { data: sponsorData } = await supabase
          .from('sponsors')
          .select('name')
          .eq('id', sponsorId)
          .single();

        const sponsorName = sponsorData?.name || 'Un parrain';

        // Create notification for the assistant
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            recipient_id: assistantData.id,
            sender_id: sponsorId,
            type: 'planned_visit',
            title: 'Nouveau voyage planifié',
            content: `${sponsorName} a planifié un voyage à Cuba`,
            metadata: {
              start_date: startDate,
              end_date: endDate,
              hotel_name: hotelName,
              wants_to_visit_child: wantsToVisitChild,
              wants_donation_pickup: wantsDonationPickup,
              sponsor_name: sponsorName
            },
            is_read: false
          });

        if (notificationError) {
          console.error("Error creating notification:", notificationError);
          throw notificationError;
        }

        console.log("Notification sent to assistant successfully");
      }

      // Update sponsor's visit information
      const { error: sponsorError } = await supabase
        .from('sponsors')
        .update({
          wants_to_visit_child: wantsToVisitChild,
          wants_donation_pickup: wantsDonationPickup,
          visit_start_date: startDate,
          visit_end_date: endDate
        })
        .eq('id', sponsorId);

      if (sponsorError) throw sponsorError;

      toast.success(t.success);
      onVisitPlanned();

      // Reset form
      setStartDate("");
      setEndDate("");
      setHotelName("");
      setWantsToVisitChild(false);
      setWantsDonationPickup(false);
    } catch (error) {
      console.error('Error planning visit:', error);
      toast.error(t.error);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">{t.planVisit}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">{t.startDate}</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">{t.endDate}</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hotelName">{t.hotelName}</Label>
          <Input
            id="hotelName"
            type="text"
            value={hotelName}
            onChange={(e) => setHotelName(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="visitChild"
            checked={wantsToVisitChild}
            onCheckedChange={setWantsToVisitChild}
          />
          <Label htmlFor="visitChild">{t.visitChild}</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="donationPickup"
            checked={wantsDonationPickup}
            onCheckedChange={setWantsDonationPickup}
          />
          <Label htmlFor="donationPickup">{t.donationPickup}</Label>
        </div>

        <Button type="submit" className="w-full">
          {t.submit}
        </Button>
      </form>
    </Card>
  );
};