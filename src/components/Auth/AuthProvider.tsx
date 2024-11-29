import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAssistant: boolean;
  isAdmin: boolean;
  session: any | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  isAssistant: false,
  isAdmin: false,
  session: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAssistant, setIsAssistant] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthChange = async (session: any) => {
    try {
      if (session?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('sponsors')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;

        setUser(profile);
        setIsAssistant(['assistant', 'admin'].includes(profile.role));
        setIsAdmin(profile.role === 'admin');

        // Redirection basée sur le rôle
        if (location.pathname === '/login') {
          switch (profile.role) {
            case 'admin':
            case 'assistant':
              navigate('/dashboard');
              break;
            case 'sponsor':
              navigate('/sponsor-dashboard');
              break;
            default:
              navigate('/');
          }
        }
      } else {
        setUser(null);
        setIsAssistant(false);
        setIsAdmin(false);

        const protectedPages = [
          '/dashboard',
          '/sponsor-dashboard',
          '/children/add',
          '/donations',
          '/rewards',
          '/messages',
          '/media-management',
          '/sponsors-management',
          '/settings',
          '/urgent-needs',
          '/permissions',
          '/children-needs'
        ];

        if (protectedPages.includes(location.pathname)) {
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      toast({
        title: "Erreur d'authentification",
        description: "Une erreur est survenue lors de la vérification de l'authentification",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial auth check
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange(session);
    });

    // Setup auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthChange(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setIsAssistant(false);
      setIsAdmin(false);
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Erreur lors de la déconnexion",
        description: "Veuillez réessayer",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signOut, 
      isAssistant, 
      isAdmin, 
      session: user 
    }}>
      {!loading && children}
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