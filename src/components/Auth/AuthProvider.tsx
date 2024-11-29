import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAssistant, setIsAssistant] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSponsor, setIsSponsor] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Liste des pages protégées
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
    '/permissions'
  ];

  // Fonction pour rediriger selon le rôle
  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case 'admin':
        navigate('/dashboard');
        break;
      case 'sponsor':
        navigate('/sponsor-dashboard');
        break;
      case 'assistant':
        navigate('/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (session?.session?.user) {
          const { data: sponsors, error } = await supabase
            .from('sponsors')
            .select('*')
            .eq('id', session.session.user.id)
            .single();

          if (error) throw error;
          
          if (sponsors) {
            setUser(sponsors);
            setIsAdmin(sponsors.role === 'admin');
            setIsAssistant(['assistant', 'admin'].includes(sponsors.role));
            setIsSponsor(sponsors.role === 'sponsor');

            // Si on est sur la page de login ou la page d'accueil, rediriger vers le dashboard approprié
            if (location.pathname === '/login' || location.pathname === '/') {
              redirectBasedOnRole(sponsors.role);
            }
          } else {
            handleLogout();
          }
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Écouter les changements d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: sponsor } = await supabase
          .from('sponsors')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (sponsor) {
          setUser(sponsor);
          setIsAdmin(sponsor.role === 'admin');
          setIsAssistant(['assistant', 'admin'].includes(sponsor.role));
          setIsSponsor(sponsor.role === 'sponsor');
          redirectBasedOnRole(sponsor.role);
        }
      } else if (event === 'SIGNED_OUT') {
        handleLogout();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    setIsAssistant(false);
    setIsSponsor(false);
    
    // Rediriger vers login si on est sur une page protégée
    if (protectedPages.includes(location.pathname)) {
      navigate('/login');
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      handleLogout();
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
      isSponsor, 
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