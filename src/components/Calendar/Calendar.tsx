import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { useState } from "react";

export const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <CalendarUI
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    </div>
  );
};