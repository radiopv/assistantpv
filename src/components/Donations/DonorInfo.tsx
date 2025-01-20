import { useLanguage } from "@/contexts/LanguageContext";

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
      error: "Impossible de charger les informations du donateur"
    },
    es: {
      donorInfo: "Información del donante",
      anonymous: "Anónimo",
      noDonors: "Sin donantes registrados",
      error: "No se pudieron cargar los datos del donante"
    }
  };

  const t = translations[language as keyof typeof translations];

  // Handle case where donors is undefined or null
  if (!donors) {
    return (
      <div className="space-y-2">
        <h4 className="font-medium">{t.donorInfo}</h4>
        <p className="text-sm text-gray-600">{t.noDonors}</p>
      </div>
    );
  }

  // Handle empty donors array
  if (donors.length === 0) {
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