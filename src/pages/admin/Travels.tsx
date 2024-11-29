import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { toast } from "sonner";

const Travels = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

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

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    toast.success("Date sélectionnée");
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des Voyages</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Calendrier des Visites</h2>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
          />
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Prochaines Visites</h2>
          <div className="space-y-4">
            {travels?.map((travel) => (
              <div key={travel.id} className="p-4 border rounded-lg">
                <p className="font-medium">
                  {travel.sponsorships?.sponsors?.name} → {travel.sponsorships?.children?.name}
                </p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(travel.visit_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Status: {travel.status}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Ajouter une Nouvelle Visite</h2>
        <Button>Planifier une visite</Button>
      </Card>
    </div>
  );
};

export default Travels;