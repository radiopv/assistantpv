import { format } from "date-fns";
import { fr, es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { User } from "lucide-react";

interface DonationCardHeaderProps {
  donation: {
    assistant_name: string;
    donation_date: string;
    status: string;
  };
}

export const DonationCardHeader = ({ donation }: DonationCardHeaderProps) => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      donationBy: "Don par",
      completed: "Complété",
      inProgress: "En cours"
    },
    es: {
      donationBy: "Donación por",
      completed: "Completado",
      inProgress: "En progreso"
    }
  };

  const t = translations[language as keyof typeof translations];
  const locale = language === 'es' ? es : fr;

  return (
    <div className="flex justify-between items-start">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-cuba-turquoise/10 flex items-center justify-center">
          <User className="h-5 w-5 text-cuba-turquoise" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">
            {t.donationBy} <span className="text-cuba-turquoise">{donation.assistant_name}</span>
          </h3>
          <p className="text-sm text-gray-500">
            {format(new Date(donation.donation_date), 'dd MMMM yyyy', { locale })}
          </p>
        </div>
      </div>
      <span
        className={cn(
          "px-3 py-1 rounded-full text-xs font-medium",
          donation.status === "completed"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        )}
      >
        {donation.status === "completed" ? t.completed : t.inProgress}
      </span>
    </div>
  );
};