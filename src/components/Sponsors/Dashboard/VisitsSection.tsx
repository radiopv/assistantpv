interface Visit {
  id: string;
  start_date: string;
  notes?: string;
}

interface VisitsSectionProps {
  visits: Visit[];
}

export const VisitsSection = ({ visits }: VisitsSectionProps) => {
  if (!visits?.length) {
    return <p className="text-gray-600">Aucune visite prévue</p>;
  }

  return (
    <div className="space-y-4">
      {visits.map((visit) => (
        <div key={visit.id} className="p-4 border rounded-lg">
          <p className="font-medium">
            {new Date(visit.start_date).toLocaleDateString()}
          </p>
          {visit.notes && (
            <p className="text-gray-600 mt-2">{visit.notes}</p>
          )}
        </div>
      ))}
    </div>
  );
};