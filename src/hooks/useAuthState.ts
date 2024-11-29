import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";

export interface AuthState {
  user: any | null;
  isAdmin: boolean;
  isAssistant: boolean;
  isSponsor: boolean;
  loading: boolean;
  session: any | null;
}

export const useAuthState = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAdmin: false,
    isAssistant: false,
    isSponsor: false,
    session: null
  });

  const resetState = () => {
    setState({
      user: null,
      loading: false,
      isAdmin: false,
      isAssistant: false,
      isSponsor: false,
      session: null
    });
  };

  const updateState = (sponsor: any) => {
    setState({
      user: sponsor,
      loading: false,
      isAdmin: sponsor.role === 'admin',
      isAssistant: ['assistant', 'admin'].includes(sponsor.role),
      isSponsor: sponsor.role === 'sponsor',
      session: sponsor
    });
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
    state,
    actions: { resetState, updateState, handleError, setState }
  };
};