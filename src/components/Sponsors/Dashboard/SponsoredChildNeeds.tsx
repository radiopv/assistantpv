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
      <ScrollArea className="h-auto max-h-[200px]">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {needs.map((need, index) => (
            <div
              key={`${need.category}-${index}`}
              className={`p-2 rounded-lg ${
                need.is_urgent
                  ? "bg-red-50 border border-red-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <div className="flex flex-col gap-1">
                <Badge
                  variant={need.is_urgent ? "destructive" : "secondary"}
                  className="w-fit"
                >
                  {NEED_CATEGORIES[need.category as keyof typeof NEED_CATEGORIES]}
                  {need.is_urgent && " (!)"} 
                </Badge>
                {need.description && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {need.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};