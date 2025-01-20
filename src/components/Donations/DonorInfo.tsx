import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface DonorInfoProps {
  donors: Array<{
    name: string;
    is_anonymous: boolean;
  }>;
}

export const DonorInfo = ({ donors }: DonorInfoProps) => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      donorInfo: "Information du donateur",
      anonymous: "Anonyme",
      noDonors: "Aucun donateur enregistré",
      error: "Erreur lors du chargement des donateurs"
    },
    es: {
      donorInfo: "Información del donante",
      anonymous: "Anónimo",
      noDonors: "Sin donantes registrados",
      error: "Error al cargar los donantes"
    }
  };

  const t = translations[language as keyof typeof translations];

  if (!donors || donors.length === 0) {
    return (
      <div className="space-y-2">
        <h4 className="font-medium">{t.donorInfo}</h4>
        <p className="text-sm text-gray-600">{t.noDonors}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="font-medium">{t.donorInfo}</h4>
      <div className="space-y-1">
        {donors.map((donor, index) => (
          <p key={index} className="text-sm text-gray-600">
            {donor.is_anonymous ? t.anonymous : donor.name}
          </p>
        ))}
      </div>
    </div>
  );
};