import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useDeleteDonation = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteDonation = async (donationId: string) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('donations')
        .delete()
        .eq('id', donationId);

      if (error) throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteDonation,
    isDeleting
  };
};