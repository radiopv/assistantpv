import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/components/Auth/AuthProvider";
import { ChildrenList } from "@/components/Children/ChildrenList";
import { Loader2 } from "lucide-react";

const SponsoredChildren = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const { data: children, isLoading } = useQuery({
    queryKey: ['sponsored-children', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('sponsor_id', user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">{t('mySponsoredChildren')}</h1>
      <ChildrenList 
        children={children || []}
        isLoading={isLoading}
        onViewProfile={(id) => window.location.href = `/children/${id}`}
      />
    </div>
  );
};

export default SponsoredChildren;