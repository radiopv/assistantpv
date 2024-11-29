import { Card } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

export const NewsList = () => {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <CalendarDays className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">Aujourd'hui</span>
        </div>
        <h3 className="font-medium">Pas d'actualités pour le moment</h3>
      </Card>
    </div>
  );
};