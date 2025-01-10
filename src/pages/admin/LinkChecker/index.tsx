import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { LinkCheckerCard } from "./LinkCheckerCard";

const LinkChecker = () => {
  const { t } = useLanguage();
  
  const { data: links = [], isLoading, refetch } = useQuery({
    queryKey: ["links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("link_checker")
        .select("*")
        .order("last_checked", { ascending: false });

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
      <div className="grid gap-4 md:grid-cols-2">
        {links.map((link) => (
          <LinkCheckerCard 
            key={link.id} 
            link={link} 
            onCheckComplete={refetch}
          />
        ))}
      </div>
    </div>
  );
};

export default LinkChecker;