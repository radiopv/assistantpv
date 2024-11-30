import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SponsorshipStatsProps {
  language: "fr" | "es";
}

const translations = {
  fr: {
    totalSponsors: "Total des parrains",
    activeSponsors: "Parrains actifs",
    totalChildren: "Enfants parrainés",
    monthlyDonations: "Dons mensuels",
  },
  es: {
    totalSponsors: "Total de padrinos",
    activeSponsors: "Padrinos activos",
    totalChildren: "Niños apadrinados",
    monthlyDonations: "Donaciones mensuales",
  }
};

export const SponsorshipStats = ({ language }: SponsorshipStatsProps) => {
  const { data: stats } = useQuery({
    queryKey: ['sponsorship-stats'],
    queryFn: async () => {
      const { data: sponsorships, error } = await supabase
        .from('sponsorships')
        .select('*');

      if (error) throw error;

      const totalSponsors = new Set(sponsorships?.map(s => s.sponsor_id)).size;
      const activeSponsors = sponsorships?.filter(s => s.status === 'active').length;
      const sponsoredChildren = new Set(sponsorships?.map(s => s.child_id)).size;
      const monthlyTotal = sponsorships
        ?.filter(s => s.status === 'active')
        .reduce((sum, s) => sum + (s.monthly_amount || 0), 0);

      return {
        totalSponsors,
        activeSponsors,
        sponsoredChildren,
        monthlyTotal
      };
    }
  });

  const t = translations[language];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4 bg-primary/5">
        <p className="text-sm text-gray-500">{t.totalSponsors}</p>
        <p className="text-2xl font-bold">{stats?.totalSponsors || 0}</p>
      </Card>
      <Card className="p-4 bg-primary/5">
        <p className="text-sm text-gray-500">{t.activeSponsors}</p>
        <p className="text-2xl font-bold">{stats?.activeSponsors || 0}</p>
      </Card>
      <Card className="p-4 bg-primary/5">
        <p className="text-sm text-gray-500">{t.totalChildren}</p>
        <p className="text-2xl font-bold">{stats?.sponsoredChildren || 0}</p>
      </Card>
      <Card className="p-4 bg-primary/5">
        <p className="text-sm text-gray-500">{t.monthlyDonations}</p>
        <p className="text-2xl font-bold">${stats?.monthlyTotal || 0}</p>
      </Card>
    </div>
  );
};