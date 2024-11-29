import { createContext, useContext, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth, UserRole } from "@/hooks/useAuth";
import { ROLE_REDIRECTS } from "@/config/routes";
import { useNavigate } from "react-router-dom";

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
  const auth = useAuth();
  const navigate = useNavigate();

  const handleRedirect = (role: UserRole) => {
    const redirectPath = ROLE_REDIRECTS[role] || '/';
    navigate(redirectPath);
  };

  const checkAuth = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        auth.handleError(sessionError, 'Session error:');
        return;
      }

      if (!session?.user) {
        auth.resetState();
        navigate('/login');
        return;
      }

      const { data: sponsor, error: sponsorError } = await supabase
        .from('sponsors')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (sponsorError) {
        auth.handleError(sponsorError, 'Error fetching sponsor:');
        return;
      }

      if (sponsor) {
        const role = sponsor.role as UserRole;
        if (role === "admin" || role === "assistant" || role === "sponsor") {
          auth.updateState(sponsor);
          handleRedirect(role);
        } else {
          auth.resetState();
          navigate('/login');
          toast({
            title: "Erreur d'authentification",
            description: "Rôle utilisateur invalide",
            variant: "destructive",
          });
        }
      } else {
        auth.resetState();
        navigate('/login');
      }
    } catch (error) {
      auth.handleError(error, 'Error checking auth:');
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
            auth.updateState(sponsor);
            handleRedirect(role);
          } else {
            auth.resetState();
            navigate('/login');
            toast({
              title: "Erreur d'authentification",
              description: "Rôle utilisateur invalide",
              variant: "destructive",
            });
          }
        } else {
          auth.resetState();
          navigate('/login');
          toast({
            title: "Erreur d'authentification",
            description: "Votre compte n'a pas les permissions nécessaires.",
            variant: "destructive",
          });
        }
      } else if (event === 'SIGNED_OUT') {
        auth.resetState();
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (auth.loading) {
    return <LoadingSpinner message="Chargement de votre session..." />;
  }

  return (
    <AuthContext.Provider value={{ 
      ...auth,
      session: auth.session 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};