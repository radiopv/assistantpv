import { Button } from "@/components/ui/button";

interface AssociationSectionProps {
  selectedChild: string | null;
  selectedSponsor: string | null;
  children: any[];
  sponsors: any[];
  onCreateAssociation: () => void;
}

export function AssociationSection({
  selectedChild,
  selectedSponsor,
  children,
  sponsors,
  onCreateAssociation,
}: AssociationSectionProps) {
  return (
    <div className="mt-8 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Créer une association</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p className="mb-2">Enfant sélectionné:</p>
          <p className="font-medium">
            {selectedChild
              ? children.find((c) => c.id === selectedChild)?.name
              : "Aucun enfant sélectionné"}
          </p>
        </div>
        <div>
          <p className="mb-2">Parrain sélectionné:</p>
          <p className="font-medium">
            {selectedSponsor
              ? sponsors.find((s) => s.id === selectedSponsor)?.name
              : "Aucun parrain sélectionné"}
          </p>
        </div>
      </div>
      <Button
        className="mt-4 w-full md:w-auto"
        onClick={onCreateAssociation}
        disabled={!selectedChild || !selectedSponsor}
      >
        Créer l'association
      </Button>
    </div>
  );
}