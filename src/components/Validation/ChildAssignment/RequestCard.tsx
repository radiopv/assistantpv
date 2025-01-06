import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChildAssignmentRequest } from "@/integrations/supabase/types/child-assignment-requests";

interface RequestCardProps {
  request: ChildAssignmentRequest;
  onApprove: (request: ChildAssignmentRequest) => void;
  onReject: (request: ChildAssignmentRequest) => void;
}

export const RequestCard = ({ request, onApprove, onReject }: RequestCardProps) => {
  const { t } = useLanguage();

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{request.name}</h3>
          <p className="text-sm text-gray-500">{request.requester_email}</p>
          <p className="text-sm text-gray-500">
            {new Date(request.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-green-600 hover:text-green-700"
            onClick={() => onApprove(request)}
          >
            <Check className="w-4 h-4 mr-1" />
            {t("approve")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={() => onReject(request)}
          >
            <X className="w-4 h-4 mr-1" />
            {t("reject")}
          </Button>
        </div>
      </div>
    </Card>
  );
};