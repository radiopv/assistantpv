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

  const loadSponsorData = async (userId: string) => {
    try {
      console.log("Loading sponsor data for user:", userId);
      const { data: sponsor, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching sponsor data:', error);
        return null;
      }

      console.log("Loaded sponsor data:", sponsor);
      return sponsor;
    } catch (error) {
      console.error('Error in loadSponsorData:', error);
      return null;
    }
  };

  const handleAuthChange = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        console.log("Found stored user:", storedUser);
        const parsedUser = JSON.parse(storedUser);
        const sponsorData = await loadSponsorData(parsedUser.id);

        if (!sponsorData) {
          console.log("No sponsor data found, logging out");
          setUser(null);
          setIsAssistant(false);
          localStorage.removeItem('user');
          navigate("/login");
          return;
        }

        console.log("Setting user with role:", sponsorData.role);
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
        console.log("No stored user found");
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
      localStorage.removeItem('user');
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleAuthChange();

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