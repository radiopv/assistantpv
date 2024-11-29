import { ChildrenNeeds } from "@/components/Dashboard/ChildrenNeeds";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ErrorAlert } from "@/components/ErrorAlert";
import { usePermissions } from '@/hooks/usePermissions';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ChildrenNeedsPage = () => {
  const { hasRole } = usePermissions();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasRole('assistant') && !hasRole('admin')) {
      navigate('/');
    }
  }, [hasRole, navigate]);

  const { data: children, isLoading, error, refetch } = useQuery({
    queryKey: ['children-with-needs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select(`
          *,
          sponsorships(
            sponsor:sponsors(
              id,
              name,
              email
            )
          )
        `)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  if (error) {
    return <ErrorAlert message="Une erreur est survenue lors du chargement des enfants" retry={() => refetch()} />;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Gestion des Besoins</h1>
      <p className="text-gray-600">
        Gérez les besoins des enfants et notifiez les parrains
      </p>
      <ChildrenNeeds 
        children={children || []} 
        isLoading={isLoading} 
        onNeedsUpdate={() => refetch()}
      />
    </div>
  );
};

export default ChildrenNeedsPage;