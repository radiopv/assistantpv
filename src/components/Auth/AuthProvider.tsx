import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: any;
  isAdmin: boolean;
  isAssistant: boolean;
  isSponsor: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isAssistant: false,
  isSponsor: false,
  loading: true,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAssistant, setIsAssistant] = useState(false);
  const [isSponsor, setIsSponsor] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  const handleRedirect = (role: string) => {
    let redirectPath = '/';
    let welcomeMessage = 'Bienvenue';

    switch (role) {
      case 'admin':
        redirectPath = '/dashboard';
        welcomeMessage = 'Bienvenue dans votre espace administrateur';
        break;
      case 'sponsor':
        redirectPath = '/sponsor-dashboard';
        welcomeMessage = 'Bienvenue dans votre espace parrain';
        break;
      case 'assistant':
        redirectPath = '/dashboard';
        welcomeMessage = 'Bienvenue dans votre espace assistant';
        break;
      default:
        redirectPath = '/';
    }

    toast({
      title: welcomeMessage,
      duration: 3000,
    });

    navigate(redirectPath);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();

        if (session.session) {
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

            if (location.pathname === '/login' || location.pathname === '/') {
              handleRedirect(sponsors.role);
            }
          } else {
            setUser(null);
            setIsAdmin(false);
            setIsAssistant(false);
            setIsSponsor(false);
            
            const protectedPages = ['/dashboard', '/sponsor-dashboard', '/children/add', '/donations', '/rewards', '/messages', '/media-management', '/sponsors-management', '/settings', '/urgent-needs', '/permissions'];
            if (protectedPages.includes(location.pathname)) {
              navigate('/login');
            }
          }
        } else {
          setUser(null);
          setIsAdmin(false);
          setIsAssistant(false);
          setIsSponsor(false);
          
          const protectedPages = ['/dashboard', '/sponsor-dashboard', '/children/add', '/donations', '/rewards', '/messages', '/media-management', '/sponsors-management', '/settings', '/urgent-needs', '/permissions'];
          if (protectedPages.includes(location.pathname)) {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
        toast({
          title: "Erreur de connexion",
          description: "Une erreur est survenue lors de la vérification de votre connexion",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: sponsors, error } = await supabase
          .from('sponsors')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!error && sponsors) {
          setUser(sponsors);
          setIsAdmin(sponsors.role === 'admin');
          setIsAssistant(['assistant', 'admin'].includes(sponsors.role));
          setIsSponsor(sponsors.role === 'sponsor');
          handleRedirect(sponsors.role);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAdmin(false);
        setIsAssistant(false);
        setIsSponsor(false);
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  return (
    <AuthContext.Provider value={{ user, isAdmin, isAssistant, isSponsor, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};