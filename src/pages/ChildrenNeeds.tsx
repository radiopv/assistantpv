import { ChildrenNeeds as ChildrenNeedsComponent } from "@/components/Dashboard/ChildrenNeeds";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { convertJsonToNeeds } from "@/types/needs";

const ChildrenNeeds = () => {
  const { data: children, isLoading } = useQuery({
    queryKey: ['children-needs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('id, name, needs');
      if (error) throw error;
      return data.map(child => ({
        ...child,
        needs: convertJsonToNeeds(child.needs)
      }));
    }
  });

  return (
    <ChildrenNeedsComponent 
      children={children || []} 
      isLoading={isLoading}
      onNeedsUpdate={() => {
        // Will be implemented later
      }}
    />
  );
};

export default ChildrenNeeds;