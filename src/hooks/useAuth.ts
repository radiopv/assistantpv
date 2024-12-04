import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export type UserRole = "admin" | "assistant" | "sponsor";

interface AuthState {
  user: any | null;
  loading: boolean;
  isAdmin: boolean;
  isAssistant: boolean;
  isSponsor: boolean;
  session: any | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAdmin: false,
    isAssistant: false,
    isSponsor: false,
    session: null,
  });

  const handleError = (error: any, message: string) => {
    console.error(message, error);
    toast({
      title: "Erreur d'authentification",
      description: "Une erreur est survenue. Veuillez réessayer.",
      variant: "destructive",
    });
    resetState();
  };

  const resetState = () => {
    setState({
      user: null,
      loading: false,
      isAdmin: false,
      isAssistant: false,
      isSponsor: false,
      session: null,
    });
  };

  const updateState = (sponsor: any) => {
    setState({
      user: sponsor,
      loading: false,
      isAdmin: sponsor.role === "admin",
      isAssistant: ["assistant", "admin"].includes(sponsor.role),
      isSponsor: sponsor.role === "sponsor",
      session: sponsor,
    });
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      resetState();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error) {
      handleError(error, "Error signing out:");
    }
  };

  return {
    ...state,
    signOut,
    handleError,
    resetState,
    updateState,
  };
};