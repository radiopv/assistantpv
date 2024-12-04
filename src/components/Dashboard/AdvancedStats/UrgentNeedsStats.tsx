import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const UrgentNeedsStats = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Besoins Urgents par Ville</h3>
      <Alert variant="warning" className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        <span>Les statistiques des besoins urgents ne sont pas encore disponibles.</span>
      </Alert>
    </Card>
  );
};