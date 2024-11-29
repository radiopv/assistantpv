import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const UrgentNeeds = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Besoins Urgents</h1>

      <div className="grid gap-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Besoins Urgents</AlertTitle>
          <AlertDescription>
            Cette page affichera les besoins urgents des enfants qui nécessitent une attention immédiate.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Liste des besoins urgents</CardTitle>
            <CardDescription>
              Consultez les besoins urgents des enfants
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Urgent needs content will go here */}
            <p>Fonctionnalité en cours de développement</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UrgentNeeds;