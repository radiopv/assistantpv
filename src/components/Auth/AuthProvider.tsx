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

  const handleRedirect = (role: string) => {
    const protectedPages = ['/dashboard', '/sponsor-dashboard', '/children/add', '/donations', '/rewards', '/messages', '/media-management', '/sponsors-management', '/settings', '/urgent-needs', '/permissions'];
    const isProtectedPage = protectedPages.includes(location.pathname);

    if (location.pathname === '/login' || isProtectedPage) {
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
    }
  };

  const resetAuthState = () => {
    setUser(null);
    setIsAdmin(false);
    setIsAssistant(false);
    setIsSponsor(false);
    setLoading(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          resetAuthState();
          return;
        }

        if (!session?.user) {
          resetAuthState();
          const protectedPages = ['/dashboard', '/sponsor-dashboard', '/children/add', '/donations', '/rewards', '/messages', '/media-management', '/sponsors-management', '/settings', '/urgent-needs', '/permissions'];
          if (protectedPages.includes(location.pathname)) {
            navigate('/login');
          }
          return;
        }

        const { data: sponsor, error: sponsorError } = await supabase
          .from('sponsors')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (sponsorError) {
          console.error('Error fetching sponsor:', sponsorError);
          resetAuthState();
          if (location.pathname !== '/login') {
            navigate('/login');
          }
          return;
        }

        if (sponsor) {
          setUser(sponsor);
          setIsAdmin(sponsor.role === 'admin');
          setIsAssistant(['assistant', 'admin'].includes(sponsor.role));
          setIsSponsor(sponsor.role === 'sponsor');
          handleRedirect(sponsor.role);
        } else {
          resetAuthState();
          if (location.pathname !== '/login') {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        resetAuthState();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: sponsor, error } = await supabase
          .from('sponsors')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!error && sponsor) {
          setUser(sponsor);
          setIsAdmin(sponsor.role === 'admin');
          setIsAssistant(['assistant', 'admin'].includes(sponsor.role));
          setIsSponsor(sponsor.role === 'sponsor');
          handleRedirect(sponsor.role);
        } else {
          resetAuthState();
          navigate('/login');
          toast({
            title: "Erreur d'authentification",
            description: "Votre compte n'a pas les permissions nécessaires.",
            variant: "destructive",
          });
        }
      } else if (event === 'SIGNED_OUT') {
        resetAuthState();
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      resetAuthState();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Erreur lors de la déconnexion",
        description: "Veuillez réessayer",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <div className="ml-4 text-gray-600">Chargement en cours...</div>
      </div>
    );
  }

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