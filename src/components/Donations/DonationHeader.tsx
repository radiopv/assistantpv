import { format } from "date-fns";
import { fr, es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface DonationHeaderProps {
  donation: {
    assistant_name: string;
    donation_date: string;
    status: string;
  };
}

export const DonationHeader = ({ donation }: DonationHeaderProps) => {
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
      <div>
        <h3 className="font-semibold">{t.donationBy} {donation.assistant_name}</h3>
        <p className="text-sm text-gray-600">
          {format(new Date(donation.donation_date), 'dd MMMM yyyy', { locale })}
        </p>
      </div>
      <span
        className={cn(
          "px-2 py-1 rounded-full text-xs",
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