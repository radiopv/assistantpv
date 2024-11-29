import { Calendar } from "@/components/ui/calendar";

const MyCalendar = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mon calendrier</h1>
      <Calendar />
    </div>
  );
};

export default MyCalendar;