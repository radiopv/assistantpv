interface MissingFieldsProps {
  missingFields: string[];
}

export const MissingFields = ({ missingFields }: MissingFieldsProps) => {
  if (missingFields.length === 0) return null;

  return (
    <div className="p-4 bg-yellow-50 rounded-lg">
      <p className="text-sm font-medium text-yellow-800 mb-2">Informations manquantes :</p>
      <ul className="list-disc list-inside text-sm text-yellow-700">
        {missingFields.map((field) => (
          <li key={field}>{field}</li>
        ))}
      </ul>
    </div>
  );
};