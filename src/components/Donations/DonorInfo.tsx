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
      anonymous: "Anonyme"
    },
    es: {
      donorInfo: "Información del donante",
      anonymous: "Anónimo"
    }
  };

  const t = translations[language as keyof typeof translations];

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