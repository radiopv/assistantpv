import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const TestimonialsAdmin = () => {
  return (
    <div className="space-y-4">
      <Button className="mb-4">Ajouter un témoignage</Button>
      <Card className="p-4">
        <h3 className="font-medium mb-2">Gestion des témoignages</h3>
        <p className="text-sm text-gray-600">
          Aucun témoignage en attente de validation
        </p>
      </Card>
    </div>
  );
};