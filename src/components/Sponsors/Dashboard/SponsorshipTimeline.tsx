import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Clock, Camera, MessageSquare } from "lucide-react";

interface TimelineEvent {
  date: string;
  type: "photo" | "testimonial" | "sponsorship_start";
  title: string;
  description?: string;
}

interface SponsorshipTimelineProps {
  events: TimelineEvent[];
}

export const SponsorshipTimeline = ({ events }: SponsorshipTimelineProps) => {
  const sortedEvents = [...events]
    .filter(event => {
      // Validate date before sorting
      const date = new Date(event.date);
      return !isNaN(date.getTime()); // Filter out invalid dates
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5); // Limit to 5 most recent events

  const getIcon = (type: string) => {
    switch (type) {
      case "photo":
        return <Camera className="w-4 h-4" />;
      case "testimonial":
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn("Invalid date:", dateString);
        return "Date invalide";
      }
      return format(date, "d MMMM yyyy", { locale: fr });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date invalide";
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-cuba-coral" />
        Moments mémorables
      </h3>
      <div className="space-y-4">
        {sortedEvents.map((event, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-cuba-warmBeige rounded-full flex items-center justify-center">
              {getIcon(event.type)}
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {formatEventDate(event.date)}
              </p>
              <p className="font-medium">{event.title}</p>
              {event.description && (
                <p className="text-sm text-gray-600">{event.description}</p>
              )}
            </div>
          </div>
        ))}
        {sortedEvents.length === 0 && (
          <p className="text-gray-500 text-center">Aucun événement à afficher</p>
        )}
      </div>
    </Card>
  );
};