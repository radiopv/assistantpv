import { useState } from "react";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthProvider";

interface Event {
  id: string;
  title: string;
  date: string;
  description?: string;
}

export const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { user } = useAuth();

  const { data: events } = useQuery({
    queryKey: ["calendar-events", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scheduled_visits")
        .select("*")
        .eq("sponsor_id", user?.id)
        .order("visit_date", { ascending: true });

      if (error) throw error;
      return data as Event[];
    },
    enabled: !!user?.id,
  });

  const selectedDateEvents = events?.filter(
    (event) =>
      date &&
      new Date(event.date).toDateString() === date.toDateString()
  );

  return (
    <div className="grid gap-6 md:grid-cols-[400px,1fr]">
      <Card className="p-4">
        <CalendarUI
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md"
        />
      </Card>

      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">
          {date
            ? `Événements du ${date.toLocaleDateString()}`
            : "Sélectionnez une date"}
        </h2>
        <div className="space-y-4">
          {selectedDateEvents?.map((event) => (
            <div key={event.id} className="border-l-2 border-primary pl-4">
              <h3 className="font-medium">{event.title}</h3>
              {event.description && (
                <p className="text-sm text-gray-600">{event.description}</p>
              )}
            </div>
          ))}
          {selectedDateEvents?.length === 0 && (
            <p className="text-gray-500">Aucun événement prévu pour cette date</p>
          )}
        </div>
      </Card>
    </div>
  );
};