import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sponsorship } from "@/types/supabase/tables/sponsorships";

const DetailedStats = () => {
  const { t } = useLanguage();

  const { data: sponsorshipStats, isLoading: sponsorshipLoading } = useQuery<{
    active: number;
    pending: number;
    ended: number;
  }>({
    queryKey: ["sponsorship-stats"],
    queryFn: async () => {
      const { data: sponsorships, error } = await supabase
        .from("sponsorships")
        .select("*") as { data: Sponsorship[] | null, error: any };

      if (error) throw error;

      return {
        active: sponsorships?.filter((s) => s.status === "active").length || 0,
        pending: sponsorships?.filter((s) => s.status === "pending").length || 0,
        ended: sponsorships?.filter((s) => s.status === "ended").length || 0,
      };
    },
  });

  if (sponsorshipLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <h2 className="text-lg font-bold">{t("sponsorshipStats")}</h2>
      <ScrollArea>
        <div>
          <p>{t("activeSponsorships")}: {sponsorshipStats?.active}</p>
          <p>{t("pendingSponsorships")}: {sponsorshipStats?.pending}</p>
          <p>{t("endedSponsorships")}: {sponsorshipStats?.ended}</p>
        </div>
      </ScrollArea>
    </Card>
  );
};

export default DetailedStats;