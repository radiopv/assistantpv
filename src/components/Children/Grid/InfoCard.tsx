import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export const InfoCard = () => (
  <Card className="p-4 bg-orange-50 border-orange-200">
    <div className="flex gap-3">
      <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-1" />
      <div className="space-y-2">
        <h3 className="font-semibold text-orange-800">À propos du parrainage</h3>
        <p className="text-orange-700 text-sm">
          Le parrainage n'est pas un engagement à long terme. Vous pouvez y mettre fin à tout moment depuis votre espace parrain, 
          sans justification nécessaire. Les enfants affichés en premier sont ceux qui ont les besoins les plus urgents 
          ou qui attendent un parrain depuis le plus longtemps.
        </p>
      </div>
    </div>
  </Card>