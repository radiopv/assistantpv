import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import type { Sponsorship } from "@/integrations/supabase/types/sponsorship";

interface RequestCardProps {
  request: Sponsorship;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const RequestCard = ({ request, onApprove, onReject }: RequestCardProps) => {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">Demande de parrainage</h3>
          <p className="text-sm text-gray-500">ID Enfant: {request.child_id}</p>
          <p className="text-sm text-gray-500">ID Parrain: {request.sponsor_id}</p>
          <p className="text-sm text-gray-500">Date: {new Date(request.created_at).toLocaleDateString()}</p>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-green-600 hover:text-green-700"
            onClick={() => onApprove(request.id)}
          >
            <Check className="w-4 h-4 mr-1" />
            Approuver
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={() => onReject(request.id)}
          >
            <X className="w-4 h-4 mr-1" />
            Rejeter
          </Button>
        </div>
      </div>
    </Card>
  );
};