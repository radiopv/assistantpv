import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const FAQAdmin = () => {
  return (
    <div className="space-y-4">
      <Button className="mb-4">Ajouter une question</Button>
      <Card className="p-4">
        <h3 className="font-medium mb-2">Questions fréquentes</h3>
        <p className="text-sm text-gray-600">
          Aucune question en attente de validation
        </p>
      </Card>
    </div>
  );
};