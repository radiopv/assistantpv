import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { SponsorsList } from "@/components/Sponsors/SponsorsList";
import { supabase } from "@/integrations/supabase/client";

const SponsorsManagement = () => {
  const { data: sponsors, isLoading } = useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select(`
          *,
          sponsorships (
            id,
            child: child_id (
              id,
              name,
              photo_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sponsors:', error);
        throw error;
      }

      return data || [];
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Gestion des Parrains</h1>
      <SponsorsList sponsors={sponsors || []} isLoading={isLoading} />
    </div>
  );
};

export default SponsorsManagement;