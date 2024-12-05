import { useLanguage } from "@/contexts/LanguageContext";

interface DonationDetailsProps {
  donation: {
    city: string;
    people_helped: number;
  };
}

export const DonationDetails = ({ donation }: DonationDetailsProps) => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      city: "Ville",
      peopleHelped: "Personnes aidées"
    },
    es: {
      city: "Ciudad",
      peopleHelped: "Personas ayudadas"
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-gray-500">{t.city}</p>
        <p className="font-medium">{donation.city}</p>
      </div>
      <div>
        <p className="text-gray-500">{t.peopleHelped}</p>
        <p className="font-medium">{donation.people_helped}</p>
      </div>
    </div>
  );
};