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
          
          // Verify if the user still exists in the database
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

          // Update last_login timestamp
          const { error: updateError } = await supabase
            .from('sponsors')
            .update({ last_login: new Date().toISOString() })
            .eq('id', sponsor.id);

          if (updateError) {
            console.error('Error updating last_login:', updateError);
          }

          console.log("Setting user with role:", sponsor.role);
          setUser(sponsor);
          setIsAssistant(['assistant', 'admin'].includes(sponsor.role));
          
          // Handle redirection based on role and current path
          const currentPath = window.location.pathname;
          if (currentPath === '/login' || currentPath === '/') {
            if (['admin', 'assistant'].includes(sponsor.role)) {
              navigate('/dashboard');
            } else {
              navigate('/sponsor-dashboard');
            }
          }
        } else {
          console.log("No stored user found");
          localStorage.removeItem('user');
          setUser(null);
          const publicRoutes = ['/login', '/', '/available-children', '/public-donations', '/statistics', '/faq'];
          if (!publicRoutes.includes(window.location.pathname)) {
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