import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { ImageUploadSection } from "./Homepage/ImageUploadSection";
import { ConfigSection } from "./Homepage/ConfigSection";
import { HomepageConfig } from "@/types/homepage";

export const HomepageManager = () => {
  const { data: config, isLoading } = useQuery<HomepageConfig[]>({
    queryKey: ['homepage-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_config')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div className="flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      <ImageUploadSection />
      {config && <ConfigSection config={config} />}
    </div>
  );
};