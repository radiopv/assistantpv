import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LinkCheckerGrid } from "./LinkCheckerGrid";
import { LinkCheckerHeader } from "./LinkCheckerHeader";
import { useLanguage } from "@/contexts/LanguageContext";

const LinkChecker = () => {
  const { t } = useLanguage();

  const { data: links = [], isLoading } = useQuery({
    queryKey: ["link-checker"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('link_checker')
        .select('*')
        .order('last_checked', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div className="p-4">{t("loading")}</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <LinkCheckerHeader />
      <LinkCheckerGrid links={links} />
    </div>
  );
};

export default LinkChecker;