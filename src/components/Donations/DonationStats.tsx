import { Card } from "@/components/ui/card";

interface DonationStatsProps {
  donations: any[];
}

export const DonationStats = ({ donations }: DonationStatsProps) => {
  const totalDonations = donations.length;
  const totalPeopleHelped = donations.reduce((acc, don) => acc + don.people_helped, 0);
  const cities = new Set(donations.map(d => d.city)).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-4 bg-primary/5">
        <p className="text-sm text-gray-500">Total des dons</p>
        <p className="text-2xl font-bold">{totalDonations}</p>
      </Card>
      <Card className="p-4 bg-primary/5">
        <p className="text-sm text-gray-500">Personnes aidées</p>
        <p className="text-2xl font-bold">{totalPeopleHelped}</p>
      </Card>
      <Card className="p-4 bg-primary/5">
        <p className="text-sm text-gray-500">Villes touchées</p>
        <p className="text-2xl font-bold">{cities}</p>
      </Card>
    </div>
  );
};