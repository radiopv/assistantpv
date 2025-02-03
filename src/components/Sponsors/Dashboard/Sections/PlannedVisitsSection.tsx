import { Card } from "@/components/ui/card";
import { PlannedVisitForm } from "../PlannedVisitForm";
import { VisitsSection } from "../VisitsSection";

interface PlannedVisitsSectionProps {
  userId: string;
  plannedVisits: any[];
  onVisitPlanned: () => void;
}

export const PlannedVisitsSection = ({
  userId,
  plannedVisits,
  onVisitPlanned
}: PlannedVisitsSectionProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        Visites Planifiées
      </h3>
      <div className="space-y-6">
        <PlannedVisitForm 
          sponsorId={userId} 
          onVisitPlanned={onVisitPlanned} 
        />
        <VisitsSection visits={plannedVisits} onVisitDeleted={onVisitPlanned} />
      </div>
    </Card>
  );
};