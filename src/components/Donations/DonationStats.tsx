interface DonationStatsProps {
  donations: any[];
  language: "fr" | "es";
}

export const DonationStats = ({ donations, language }: DonationStatsProps) => {
  const totalDonations = donations.length;
  const totalPeopleHelped = donations.reduce((acc, don) => acc + don.people_helped, 0);
  const cities = new Set(donations.map(d => d.city)).size;

  const translations = {
    fr: {
      totalDonations: "Total des dons",
      peopleHelped: "Personnes aidées",
      citiesReached: "Villes touchées"
    },
    es: {
      totalDonations: "Total de donaciones",
      peopleHelped: "Personas ayudadas",
      citiesReached: "Ciudades alcanzadas"
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-4 bg-primary/5">
        <p className="text-sm text-gray-500">{translations[language].totalDonations}</p>
        <p className="text-2xl font-bold">{totalDonations}</p>
      </Card>
      <Card className="p-4 bg-primary/5">
        <p className="text-sm text-gray-500">{translations[language].peopleHelped}</p>
        <p className="text-2xl font-bold">{totalPeopleHelped}</p>
      </Card>
      <Card className="p-4 bg-primary/5">
        <p className="text-sm text-gray-500">{translations[language].citiesReached}</p>
        <p className="text-2xl font-bold">{cities}</p>
      </Card>
    </div>
  );
};