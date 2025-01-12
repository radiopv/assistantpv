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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication...");
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("Found stored user:", parsedUser);
          
          // Vérifier si l'utilisateur existe toujours dans la base de données
          const { data: sponsor, error: sponsorError } = await supabase
            .from('sponsors')
            .select('*')
            .eq('id', parsedUser.id)
            .maybeSingle();

          if (sponsorError) {
            console.error('Error verifying sponsor:', sponsorError);
            throw sponsorError;
          }

          if (!sponsor) {
            console.error('Sponsor not found in database');
            throw new Error('Sponsor not found');
          }

          console.log("Setting user with role:", sponsor.role);
          setUser(sponsor);
          setIsAssistant(['assistant', 'admin'].includes(sponsor.role));
          
          // Redirection basée sur le rôle
          if (window.location.pathname === '/login') {
            if (sponsor.role === 'admin' || sponsor.role === 'assistant') {
              navigate('/dashboard');
            } else {
              navigate('/sponsor-dashboard');
            }
          }
        } else {
          console.log("No stored user found");
          localStorage.removeItem('user');
          setUser(null);
          if (!window.location.pathname.startsWith('/login')) {
            navigate("/login");
          }
        }
      } catch (error) {
        console.error('Error in checkAuth:', error);
        localStorage.removeItem('user');
        setUser(null);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    // Vérification initiale de l'authentification
    checkAuth();
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