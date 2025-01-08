import { Need } from "@/types/needs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SponsoredChildNeedsProps {
  needs: Need[];
  childName: string;
}

export const SponsoredChildNeeds = ({ needs, childName }: SponsoredChildNeedsProps) => {
  const NEED_CATEGORIES = {
    education: "Éducation",
    jouet: "Juguetes",
    vetement: "Ropa",
    nourriture: "Alimentación",
    medicament: "Medicamentos",
    hygiene: "Higiene",
    autre: "Otros"
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Besoins de {childName}</h3>
      <ScrollArea className="h-auto max-h-[400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2">
          {needs.map((need, index) => (
            <div key={`${need.category}-${index}`} className="space-y-2">
              <div
                className={`${
                  need.is_urgent
                    ? "bg-red-50 border border-red-200"
                    : "bg-gray-50 border border-gray-200"
                } p-3 rounded-lg`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={need.is_urgent ? "destructive" : "secondary"}
                      className="w-fit"
                    >
                      {NEED_CATEGORIES[need.category as keyof typeof NEED_CATEGORIES]}
                      {need.is_urgent && " (!)"} 
                    </Badge>
                  </div>
                  {need.description && (
                    <p className="text-sm text-gray-600">
                      {need.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};