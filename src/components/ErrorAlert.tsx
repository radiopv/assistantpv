import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ErrorAlertProps {
  message: string;
  retry?: () => void;
}

export const ErrorAlert = ({ message, retry }: ErrorAlertProps) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <div className="flex items-center justify-between">
        <p>{message}</p>
        {retry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={retry}
            className="h-8 px-2 lg:px-3"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="ml-2">Réessayer</span>
          </Button>
        )}
      </div>
    </Alert>
  );
};