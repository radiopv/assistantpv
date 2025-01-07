import { Card } from "@/components/ui/card";
import { Calendar, Gift, Plane } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ImportantDatesCardProps {
  birthDate: string;
  plannedVisits: Array<{
    id: string;
    start_date: string;
    end_date: string;
  }>;
}

export const ImportantDatesCard = ({ birthDate, plannedVisits }: ImportantDatesCardProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          <h3 className="font-semibold">Dates importantes</h3>
        </div>
        
        <div className="space-y-2">
          <p className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-primary" />
            Anniversaire : {format(new Date(birthDate), 'dd MMMM', { locale: fr })}
          </p>
          
          {plannedVisits?.map((visit) => (
            <p key={visit.id} className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-primary" />
              Visite prévue : {format(new Date(visit.start_date), 'dd MMMM yyyy', { locale: fr })}
            </p>
          ))}
        </div>
      </div>
    </Card>
  );
};