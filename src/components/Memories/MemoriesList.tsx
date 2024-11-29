import { Card } from "@/components/ui/card";
import { Image } from "lucide-react";

export const MemoriesList = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Image className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium">Mes souvenirs</h3>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Aucun souvenir pour le moment
        </p>
      </Card>
    </div>
  );
};