import { useLanguage } from "@/contexts/LanguageContext";

interface DonationStatsProps {
  donations: any[];
}

export const DonationStats = ({ donations }: DonationStatsProps) => {
  const { language } = useLanguage();

  const totalDonations = donations.length;
  const totalPeopleHelped = donations.reduce((acc, curr) => acc + (curr.people_helped || 0), 0);
  const citiesCovered = new Set(donations.map(d => d.city)).size;

  const translations = {
    fr: {
      totalDonations: "Dons totaux",
      peopleHelped: "Personnes aidées",
      citiesCovered: "Villes couvertes",
    },
    es: {
      totalDonations: "Donaciones totales",
      peopleHelped: "Personas ayudadas",
      citiesCovered: "Ciudades cubiertas",
    }
  };

  const t = translations[language as keyof typeof translations] || translations.fr;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="text-center">
        <h3 className="text-white/70 text-sm uppercase">{t.totalDonations}</h3>
        <p className="text-3xl font-bold text-white">{totalDonations}</p>
      </div>
      <div className="text-center">
        <h3 className="text-white/70 text-sm uppercase">{t.peopleHelped}</h3>
        <p className="text-3xl font-bold text-white">{totalPeopleHelped}</p>
      </div>
      <div className="text-center">
        <h3 className="text-white/70 text-sm uppercase">{t.citiesCovered}</h3>
        <p className="text-3xl font-bold text-white">{citiesCovered}</p>
      </div>
    </div>
  );
};