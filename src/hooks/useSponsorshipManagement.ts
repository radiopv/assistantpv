import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SponsorshipWithDetails, GroupedSponsorship, ChildWithSponsorDetails } from "@/integrations/supabase/types/sponsorship";

export const useSponsorshipManagement = () => {
  const queryClient = useQueryClient();

  const { data: sponsorships, isLoading: sponsorshipsLoading } = useQuery({
    queryKey: ['sponsorships'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsorships')
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
        .from('children')
        .select(`
          *,
          sponsors (
            id,
            name,
            email
          )
        `)
        .order('name');

      if (error) throw error;
      return data as ChildWithSponsorDetails[];
    }
  });

  const createSponsorship = useMutation({
    mutationFn: async ({ sponsor_id, child_id }: { sponsor_id: string; child_id: string }) => {
      const { error } = await supabase
        .from('sponsorships')
        .insert({
          sponsor_id,
          child_id,
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
    mutationFn: async (sponsorship_id: string) => {
      const { error } = await supabase
        .from('sponsorships')
        .delete()
        .eq('id', sponsorship_id);

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