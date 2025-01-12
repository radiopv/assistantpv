import { Card } from "@/components/ui/card";
import { Calendar, Gift } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";

interface ImportantDatesCardProps {
  birthDates: Array<{
    childName: string;
    birthDate: string;
  }>;
  plannedVisits: Array<{
    start_date: string;
    end_date: string;
  }>;
}

export const ImportantDatesCard = ({ birthDates, plannedVisits }: ImportantDatesCardProps) => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      importantDates: "Dates Importantes",
      birthdayOf: "Anniversaire de",
      plannedVisit: "Visite prévue",
      to: "au"
    },
    es: {
      importantDates: "Fechas Importantes",
      birthdayOf: "Cumpleaños de",
      plannedVisit: "Visita planificada",
      to: "al"
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-none">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-cuba-turquoise" />
        <h3 className="font-semibold text-lg">{t.importantDates}</h3>
      </div>
      
      <div className="space-y-4">
        {birthDates.map((child, index) => (
          <div key={`${child.childName}-${index}`} className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-cuba-pink" />
            <p>
              {t.birthdayOf} {child.childName} : {" "}
              {format(new Date(child.birthDate), 'dd MMMM', { locale: fr })}
            </p>
          </div>
        ))}
        
        {plannedVisits.map((visit, index) => (
          <div key={index} className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cuba-coral" />
            <p>
              {t.plannedVisit} : {format(new Date(visit.start_date), 'dd/MM/yyyy')} {" "}
              {t.to} {format(new Date(visit.end_date), 'dd/MM/yyyy')}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};