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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        if (session?.user) {
          console.log("Found authenticated user:", session.user);
          
          const { data: sponsor, error: sponsorError } = await supabase
            .from('sponsors')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (sponsorError) {
            console.error('Error fetching sponsor:', sponsorError);
            throw sponsorError;
          }

          if (!sponsor) {
            console.error('Sponsor not found in database');
            throw new Error('Sponsor not found');
          }

          console.log("Setting user with role:", sponsor.role);
          localStorage.setItem('user', JSON.stringify(sponsor));
          setUser(sponsor);
          setIsAssistant(['assistant', 'admin'].includes(sponsor.role));
          
          // Redirect based on role
          if (window.location.pathname === '/login') {
            if (sponsor.role === 'admin' || sponsor.role === 'assistant') {
              navigate('/dashboard');
            } else {
              navigate('/sponsor-dashboard');
            }
          }
        } else {
          console.log("No authenticated session found");
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

    // Initial auth check
    checkAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const { data: sponsor, error } = await supabase
            .from('sponsors')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) throw error;
          if (!sponsor) throw new Error('Sponsor not found');

          localStorage.setItem('user', JSON.stringify(sponsor));
          setUser(sponsor);
          setIsAssistant(['assistant', 'admin'].includes(sponsor.role));
          
          toast({
            title: "Connexion réussie",
            description: "Bienvenue !",
          });
          
          if (sponsor.role === 'admin' || sponsor.role === 'assistant') {
            navigate('/dashboard');
          } else {
            navigate('/sponsor-dashboard');
          }
        } catch (error) {
          console.error('Error handling sign in:', error);
          toast({
            title: "Erreur de connexion",
            description: "Une erreur est survenue lors de la connexion",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          localStorage.removeItem('user');
          setUser(null);
          navigate("/login");
        }
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('user');
        setUser(null);
        setIsAssistant(false);
        navigate("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
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