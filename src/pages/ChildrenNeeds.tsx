import { ChildrenNeeds as ChildrenNeedsComponent } from "@/components/Dashboard/ChildrenNeeds";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ErrorAlert } from "@/components/ErrorAlert";

const ChildrenNeedsPage = () => {
  const { data: children, isLoading, error, refetch } = useQuery({
    queryKey: ['children-with-needs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (error) {
    return <ErrorAlert message="Une erreur est survenue lors du chargement des enfants" retry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Besoins des Enfants</h1>
      <ChildrenNeedsComponent 
        children={children || []} 
        isLoading={isLoading} 
        onNeedsUpdate={() => refetch()}
      />
    </div>
  );
};

export default ChildrenNeedsPage;