import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SponsorshipWithDetails, GroupedSponsorship } from "@/integrations/supabase/types/sponsorship";
import { TableNames } from "@/integrations/supabase/types/database-tables";

export const useSponsorshipManagement = () => {
  const queryClient = useQueryClient();

  const { data: sponsorships, isLoading: sponsorshipsLoading } = useQuery({
    queryKey: ['sponsorships'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TableNames.SPONSORSHIPS)
        .select(`
          *,
          sponsors (
            id,
            name,
            email,
            photo_url
          ),
          children (
            id,
            name,
            photo_url,
            age
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Grouper les parrainages par email du parrain
      const groupedData = (data as SponsorshipWithDetails[]).reduce<GroupedSponsorship[]>((acc, curr) => {
        const existingGroup = acc.find(g => g.sponsor.email === curr.sponsors.email);
        
        if (existingGroup) {
          existingGroup.sponsorships.push({
            id: curr.id,
            child: curr.children
          });
        } else {
          acc.push({
            sponsor: curr.sponsors,
            sponsorships: [{
              id: curr.id,
              child: curr.children
            }]
          });
        }
        
        return acc;
      }, []);

      return groupedData;
    }
  });

  const { data: allChildren, isLoading: childrenLoading } = useQuery({
    queryKey: ['all-children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TableNames.CHILDREN)
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  const createSponsorship = useMutation({
    mutationFn: async (childId: string) => {
      const { error } = await supabase
        .from(TableNames.SPONSORSHIPS)
        .insert({
          child_id: childId,
          start_date: new Date().toISOString(),
          status: 'active'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsorships'] });
      queryClient.invalidateQueries({ queryKey: ['all-children'] });
      toast.success("Le parrainage a été créé avec succès");
    },
    onError: () => {
      toast.error("Une erreur est survenue lors de la création du parrainage");
    }
  });

  const deleteSponsorship = useMutation({
    mutationFn: async (sponsorshipId: string) => {
      const { error } = await supabase
        .from(TableNames.SPONSORSHIPS)
        .delete()
        .eq('id', sponsorshipId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsorships'] });
      queryClient.invalidateQueries({ queryKey: ['all-children'] });
      toast.success("Le parrainage a été supprimé avec succès");
    },
    onError: () => {
      toast.error("Une erreur est survenue lors de la suppression du parrainage");
    }
  });

  return {
    sponsorships,
    allChildren,
    isLoading: sponsorshipsLoading || childrenLoading,
    createSponsorship,
    deleteSponsorship
  };
};