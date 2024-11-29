import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { toast } from "@/components/ui/use-toast";

export interface AuthState {
  user: any | null;
  isAdmin: boolean;
  isAssistant: boolean;
  isSponsor: boolean;
  loading: boolean;
}

export const useAuthState = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAssistant, setIsAssistant] = useState(false);
  const [isSponsor, setIsSponsor] = useState(false);

  const resetState = () => {
    setUser(null);
    setIsAdmin(false);
    setIsAssistant(false);
    setIsSponsor(false);
    setLoading(false);
  };

  const updateState = (sponsor: any) => {
    setUser(sponsor);
    setIsAdmin(sponsor.role === 'admin');
    setIsAssistant(['assistant', 'admin'].includes(sponsor.role));
    setIsSponsor(sponsor.role === 'sponsor');
    setLoading(false);
  };

  const handleError = (error: any, message: string) => {
    console.error(message, error);
    toast({
      title: "Erreur d'authentification",
      description: "Une erreur est survenue. Veuillez réessayer.",
      variant: "destructive",
    });
    resetState();
  };

  return {
    state: { user, loading, isAdmin, isAssistant, isSponsor },
    actions: { resetState, updateState, handleError, setLoading }
  };
};