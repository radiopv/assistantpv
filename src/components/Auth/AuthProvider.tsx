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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: sponsor } = await supabase
          .from('sponsors')
          .select('*')
          .single();

        if (sponsor) {
          setUser(sponsor);
          setIsAdmin(sponsor.role === 'admin');
          setIsAssistant(['assistant', 'admin'].includes(sponsor.role));
          setIsSponsor(sponsor.role === 'sponsor');

          // Only redirect if on login page
          if (location.pathname === '/login') {
            switch (sponsor.role) {
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
        } else {
          setUser(null);
          setIsAdmin(false);
          setIsAssistant(false);
          setIsSponsor(false);
          
          // Redirect to login only for protected pages
          const protectedPages = ['/dashboard', '/sponsor-dashboard', '/children/add', '/donations', '/rewards', '/messages', '/media-management', '/sponsors-management', '/settings', '/urgent-needs', '/permissions'];
          if (protectedPages.includes(location.pathname)) {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
      setIsAssistant(false);
      setIsSponsor(false);
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