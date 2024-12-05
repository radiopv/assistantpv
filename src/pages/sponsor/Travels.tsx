import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@supabase/auth-helpers-react";
import { VisitScheduler } from "@/components/Travels/VisitScheduler";
import { ScheduledVisitsList } from "@/components/Travels/ScheduledVisitsList";
import type { ScheduledVisit } from "@/types/scheduled-visits";

const Travels = () => {
  const { t } = useLanguage();
  const user = useUser();

  const { data: travels, isLoading } = useQuery({
    queryKey: ['travels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scheduled_visits')
        .select(`
          *,
          sponsorships (
            sponsors (
              name,
              email
            ),
            children (
              name,
              city
            )
          )
        `)
        .order('visit_start_date', { ascending: true });

      if (error) throw error;
      return data as ScheduledVisit[];
    }
  });

  const isAssistant = user?.role === 'assistant';

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  return (
    <div className="space-y-6">
      {isAssistant ? (
        <ScheduledVisitsList visits={travels || []} />
      ) : (
        <div>
          <VisitScheduler userId={user?.id || ''} />
        </div>
      )}
    </div>
  );
};

export default Travels;