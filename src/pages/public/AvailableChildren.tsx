import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChildrenList } from "@/components/Children/ChildrenList";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const AvailableChildren = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { data: children, isLoading } = useQuery({
    queryKey: ['available-children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('is_sponsored', false)
        .order('name');
      
      if (error) throw error;
      return data;
    }
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
      <h1 className="text-2xl font-bold">{t("childrenWaitingSponsorship")}</h1>
      <ChildrenList 
        children={children || []}
        isLoading={isLoading}
        onViewProfile={(id) => navigate(`/children/${id}`)}
      />
    </div>
  );
};

export default AvailableChildren;