import { createContext, useContext, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

type UserRole = "admin" | "assistant" | "sponsor";

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAssistant: boolean;
  isAdmin: boolean;
  isSponsor: boolean;
  session: any | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  isAssistant: false,
  isAdmin: false,
  isSponsor: false,
  session: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { state, actions } = useAuthState();
  const { handleRedirect, redirectToLogin } = useAuthRedirect();

  const checkAuth = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        actions.handleError(sessionError, 'Session error:');
        return;
      }

      if (!session?.user) {
        actions.resetState();
        redirectToLogin();
        return;
      }

      const { data: sponsor, error: sponsorError } = await supabase
        .from('sponsors')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (sponsorError) {
        actions.handleError(sponsorError, 'Error fetching sponsor:');
        return;
      }

      if (sponsor) {
        const role = sponsor.role as UserRole;
        if (role === "admin" || role === "assistant" || role === "sponsor") {
          actions.updateState(sponsor);
          handleRedirect(role);
        } else {
          actions.resetState();
          redirectToLogin();
          toast({
            title: "Erreur d'authentification",
            description: "Rôle utilisateur invalide",
            variant: "destructive",
          });
        }
      } else {
        actions.resetState();
        redirectToLogin();
      }
    } catch (error) {
      actions.handleError(error, 'Error checking auth:');
    }
  };

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: sponsor, error } = await supabase
          .from('sponsors')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!error && sponsor) {
          const role = sponsor.role as UserRole;
          if (role === "admin" || role === "assistant" || role === "sponsor") {
            actions.updateState(sponsor);
            handleRedirect(role);
          } else {
            actions.resetState();
            redirectToLogin();
            toast({
              title: "Erreur d'authentification",
              description: "Rôle utilisateur invalide",
              variant: "destructive",
            });
          }
        } else {
          actions.resetState();
          redirectToLogin();
          toast({
            title: "Erreur d'authentification",
            description: "Votre compte n'a pas les permissions nécessaires.",
            variant: "destructive",
          });
        }
      } else if (event === 'SIGNED_OUT') {
        actions.resetState();
        redirectToLogin();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      actions.resetState();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      redirectToLogin();
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Erreur lors de la déconnexion",
        description: "Veuillez réessayer",
        variant: "destructive",
      });
    }
  };

  if (state.loading) {
    return <LoadingSpinner message="Chargement en cours..." />;
  }

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      signOut,
      session: state.user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};