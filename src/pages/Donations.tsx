import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Donations = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dons</h1>
          <p className="text-gray-600 mt-2">Gérez les dons et leur distribution</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un don
        </Button>
      </div>

      <Card className="p-6">
        <p className="text-center text-gray-600">
          Cette fonctionnalité sera bientôt disponible
        </p>
      </Card>
    </div>
  );
};

export default Donations;