import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface DonationStatsProps {
  donations: any[];
}

export const DonationStats = ({ donations }: DonationStatsProps) => {
  const { t } = useLanguage();
  const totalDonations = donations.length;
  const totalPeopleHelped = donations.reduce((acc, don) => acc + don.people_helped, 0);
  const cities = new Set(donations.map(d => d.city)).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-4 bg-primary/5">
        <p className="text-sm text-gray-500">{t('totalDonations')}</p>
        <p className="text-2xl font-bold text-[#8B5CF6]">{totalDonations}</p>
      </Card>
      <Card className="p-4 bg-primary/5">
        <p className="text-sm text-gray-500">{t('peopleHelped')}</p>
        <p className="text-2xl font-bold text-[#F97316]">{totalPeopleHelped}</p>
      </Card>
      <Card className="p-4 bg-primary/5">
        <p className="text-sm text-gray-500">{t('citiesCovered')}</p>
        <p className="text-2xl font-bold text-[#221F26]">{cities}</p>
      </Card>
    </div>
  );
};