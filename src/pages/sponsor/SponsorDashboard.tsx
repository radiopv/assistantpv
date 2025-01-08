import { useAuth } from "@/components/Auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SponsoredChildrenDisplay } from "@/components/Sponsors/SponsoredChildrenDisplay";
import { DashboardActions } from "@/components/Sponsors/Dashboard/DashboardActions";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const SponsorDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const { data: sponsorships, isLoading } = useQuery({
    queryKey: ["sponsorships", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsorships")
        .select(`
          *,
          children (
            id,
            name,
            birth_date,
            photo_url,
            city
          )
        `)
        .eq("sponsor_id", user?.id)
        .eq("status", "active");

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">{t("sponsorDashboard")}</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <SponsoredChildrenDisplay sponsorships={sponsorships || []} />
        </Card>
        
        <Card className="p-6">
          <DashboardActions />
        </Card>
      </div>
    </div>
  );
};

export default SponsorDashboard;