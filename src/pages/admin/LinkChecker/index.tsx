import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LinkCheckerGrid } from "./LinkCheckerGrid";
import { useLanguage } from "@/contexts/LanguageContext";

const LinkChecker = () => {
  const { t } = useLanguage();
  
  const { data: links = [], isLoading } = useQuery({
    queryKey: ["links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("link_checker")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="p-4">{t("loading")}</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">{t("linkChecker")}</h1>
      <LinkCheckerGrid links={links} />
    </div>
  );
};

export default LinkChecker;