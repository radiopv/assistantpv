import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAssistant: boolean;
  session: any | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  isAssistant: false,
  session: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAssistant, setIsAssistant] = useState(false);
  const navigate = useNavigate();

  // Fonction pour charger les données du sponsor
  const loadSponsorData = async (userId: string) => {
    try {
      const { data: sponsor, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching sponsor data:', error);
        localStorage.removeItem('user');
        setUser(null);
        navigate("/login");
        return null;
      }

      return sponsor;
    } catch (error) {
      console.error('Error in loadSponsorData:', error);
      return null;
    }
  };

  // Gestionnaire d'authentification principal
  const handleAuthChange = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const sponsorData = await loadSponsorData(parsedUser.id);

        if (!sponsorData) {
          setUser(null);
          setIsAssistant(false);
          navigate("/login");
          return;
        }

        setUser(sponsorData);
        setIsAssistant(['assistant', 'admin'].includes(sponsorData.role));

        // Redirection après connexion
        if (window.location.pathname === '/login') {
          if (sponsorData.role === 'admin' || sponsorData.role === 'assistant') {
            navigate('/dashboard');
          } else {
            navigate('/sponsor-dashboard');
          }
        }
      } else {
        setUser(null);
        setIsAssistant(false);
        if (!window.location.pathname.startsWith('/') && window.location.pathname !== '/login') {
          navigate("/login");
        }
      }
    } catch (error) {
      console.error('Error in handleAuthChange:', error);
      setUser(null);
      setIsAssistant(false);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour gérer les changements d'authentification
  useEffect(() => {
    handleAuthChange();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        handleAuthChange();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    try {
      localStorage.removeItem('user');
      setUser(null);
      setIsAssistant(false);
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

  return (
    <AuthContext.Provider value={{ user, loading, signOut, isAssistant, session: user }}>
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