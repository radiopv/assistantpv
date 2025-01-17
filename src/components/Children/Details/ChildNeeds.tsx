import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Need } from "@/types/needs";
import { Badge } from "@/components/ui/badge";
import { translateNeedCategory } from "@/utils/needsTranslation";

interface ChildNeedsProps {
  needs: Need[];
}

export const ChildNeeds = ({ needs }: ChildNeedsProps) => {
  const urgentNeeds = needs.filter(need => need.is_urgent);
  const regularNeeds = needs.filter(need => !need.is_urgent);

  return (
    <>
      {urgentNeeds.length > 0 && (
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-cuba-coral/20">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-red-700">Besoins urgents</h3>
            </div>
            <div className="space-y-3">
              {urgentNeeds.map((need, index) => (
                <div key={index} className="bg-white/50 p-4 rounded-md border border-red-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="destructive" className="mb-2">
                        {translateNeedCategory(need.category)}
                      </Badge>
                      {need.description && (
                        <p className="text-red-700 mt-2">{need.description}</p>
                      )}
                    </div>
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {regularNeeds.length > 0 && (
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-cuba-coral/20">
          <h3 className="text-xl font-semibold mb-4 text-cuba-coral">Autres besoins</h3>
          <div className="grid gap-3">
            {regularNeeds.map((need, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-gray-50 border border-gray-200 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {translateNeedCategory(need.category)}
                    </Badge>
                    {need.description && (
                      <p className="text-sm mt-2 text-gray-600">
                        {need.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );
};