import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();

  return (
    <div className="mt-8 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">{t("createAssociation")}</h3>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        <div className="space-y-2">
          <p className="font-medium">{t("selectedChild")}:</p>
          <p className="text-gray-700">
            {selectedChild
              ? children.find((c) => c.id === selectedChild)?.name
              : t("noChildSelected")}
          </p>
        </div>
        <div className="space-y-2">
          <p className="font-medium">{t("selectedSponsor")}:</p>
          <p className="text-gray-700">
            {selectedSponsor
              ? sponsors.find((s) => s.id === selectedSponsor)?.name
              : t("noSponsorSelected")}
          </p>
        </div>
      </div>
      <Button
        className="mt-6 w-full sm:w-auto"
        onClick={onCreateAssociation}
        disabled={!selectedChild || !selectedSponsor}
      >
        {t("createAssociationButton")}
      </Button>
    </div>
  );
}