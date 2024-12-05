import { Card } from "@/components/ui/card";
import { RequestCard } from "./RequestCard";

interface RequestsListProps {
  requests: Array<{
    id: string;
    full_name: string;
    email: string;
    city: string | null;
    is_long_term: boolean | null;
    motivation: string | null;
  }>;
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