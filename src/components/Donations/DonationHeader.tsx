import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DonationHeaderProps {
  donation: {
    assistant_name: string;
    donation_date: string;
    status: string;
  };
}

export const DonationHeader = ({ donation }: DonationHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-semibold">Don par {donation.assistant_name}</h3>
        <p className="text-sm text-gray-600">
          {format(new Date(donation.donation_date), 'dd MMMM yyyy', { locale: fr })}
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
        {donation.status === "completed" ? "Complété" : "En cours"}
      </span>
    </div>
  );
};