import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface RequestCardProps {
  request: {
    id: string;
    full_name: string;
    email: string;
    city: string | null;
    is_long_term: boolean | null;
    motivation: string | null;
  };
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const RequestCard = ({ request, onApprove, onReject }: RequestCardProps) => {
  return (
    <div className="border p-4 rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{request.full_name}</h3>
          <p className="text-sm text-gray-600">{request.email}</p>
          <p className="text-sm text-gray-600">{request.city || 'Ville non spécifiée'}</p>
          <p className="text-sm text-gray-600">
            {request.is_long_term ? "Parrainage à long terme" : "Parrainage unique"}
          </p>
          {request.motivation && (
            <p className="mt-2 text-gray-700">{request.motivation}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="text-green-600 hover:text-green-700"
            onClick={() => onApprove(request.id)}
          >
            <Check className="w-4 h-4 mr-1" />
            Approuver
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700"
            onClick={() => onReject(request.id)}
          >
            <X className="w-4 h-4 mr-1" />
            Rejeter
          </Button>
        </div>
      </div>
    </div>
  );
};