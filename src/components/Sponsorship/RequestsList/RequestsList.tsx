import { Card } from "@/components/ui/card";
import { RequestCard } from "./RequestCard";
import type { Sponsorship } from "@/integrations/supabase/types/sponsorship";

interface RequestsListProps {
  requests: Sponsorship[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const RequestsList = ({ requests, onApprove, onReject }: RequestsListProps) => {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        {requests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            onApprove={onApprove}
            onReject={onReject}
          />
        ))}
        {requests.length === 0 && (
          <p className="text-center text-gray-500">
            Aucune demande en attente
          </p>
        )}
      </div>
    </Card>
  );
};