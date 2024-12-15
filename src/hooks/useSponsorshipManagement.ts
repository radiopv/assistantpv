import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { SponsorshipWithDetails } from "@/integrations/supabase/types/sponsorship";

export const useSponsorshipManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sponsorships, isLoading: sponsorshipsLoading } = useQuery({
    queryKey: ['sponsorships'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsorships')
        .select(`
          *,
          sponsors (
            name,
            email,
            photo_url
          ),
          children (
            name,
            photo_url,
            age
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SponsorshipWithDetails[];
    }
  });

  const { data: availableChildren, isLoading: childrenLoading } = useQuery({
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

  const createSponsorship = useMutation({
    mutationFn: async ({ 
      sponsor_id, 
      child_id 
    }: { 
      sponsor_id: string; 
      child_id: string; 
    }) => {
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
      queryClient.invalidateQueries({ queryKey: ['available-children'] });
      toast({
        title: "Succès",
        description: "Le parrainage a été créé avec succès",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du parrainage",
      });
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
      queryClient.invalidateQueries({ queryKey: ['available-children'] });
      toast({
        title: "Succès",
        description: "Le parrainage a été supprimé avec succès",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du parrainage",
      });
    }
  });

  return {
    sponsorships,
    availableChildren,
    isLoading: sponsorshipsLoading || childrenLoading,
    createSponsorship,
    deleteSponsorship
  };
};