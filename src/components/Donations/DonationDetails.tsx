import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Users } from "lucide-react";

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
    <div className="grid grid-cols-2 gap-6 bg-white/50 rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-2">
        <MapPin className="h-4 w-4 text-cuba-turquoise" />
        <div>
          <p className="text-sm text-gray-500">{t.city}</p>
          <p className="font-medium text-gray-900">{donation.city}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Users className="h-4 w-4 text-cuba-turquoise" />
        <div>
          <p className="text-sm text-gray-500">{t.peopleHelped}</p>
          <p className="font-medium text-gray-900">{donation.people_helped}</p>
        </div>
      </div>
    </div>
  );
};