import { formatDate } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DonationCardHeaderProps {
  donation: {
    assistant_name: string;
    city: string;
    donation_date: string;
  };
  onDeleteClick?: () => void;
}

export const DonationCardHeader = ({ donation, onDeleteClick }: DonationCardHeaderProps) => {
  return (
    <div className="p-6 bg-gray-50 border-b flex justify-between items-start">
      <div className="flex-1 text-center">
        <h3 className="font-semibold text-lg">{donation.assistant_name}</h3>
        <div className="text-sm text-gray-500 space-y-1">
          <p>{donation.city}</p>
          <p>{formatDate(donation.donation_date)}</p>
        </div>
      </div>
      {onDeleteClick && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onDeleteClick}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};