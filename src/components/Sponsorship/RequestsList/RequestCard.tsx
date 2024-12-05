import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import type { SponsorshipRequest } from "@/integrations/supabase/types/sponsorship";

interface RequestCardProps {
  request: SponsorshipRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const RequestCard = ({ request, onApprove, onReject }: RequestCardProps) => {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{request.full_name}</h3>
          <p className="text-sm text-gray-500">{request.email}</p>
          {request.phone && (
            <p className="text-sm text-gray-500">{request.phone}</p>
          )}
          {request.city && (
            <p className="text-sm text-gray-500">{request.city}</p>
          )}
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

      {request.motivation && (
        <div>
          <h4 className="font-medium mb-1">Motivation</h4>
          <p className="text-sm text-gray-600">{request.motivation}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 text-sm">
        <span className="px-2 py-1 bg-gray-100 rounded-full">
          {request.is_long_term ? 'Parrainage long terme' : 'Parrainage ponctuel'}
        </span>
        {request.facebook_url && (
          <a
            href={request.facebook_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Profil Facebook
          </a>
        )}
      </div>
    </Card>
  );
};