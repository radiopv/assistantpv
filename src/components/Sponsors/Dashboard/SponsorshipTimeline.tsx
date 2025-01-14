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
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
                {format(new Date(event.date), "d MMMM yyyy", { locale: fr })}
              </p>
              <p className="font-medium">{event.title}</p>
              {event.description && (
                <p className="text-sm text-gray-600">{event.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
});