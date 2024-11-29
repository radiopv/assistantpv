import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export const TestimonialsList = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium">Mes témoignages</h3>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Aucun témoignage pour le moment
        </p>
      </Card>
    </div>
  );
};