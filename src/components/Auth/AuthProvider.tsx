import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  user: any;
  isAssistant: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAssistant: false,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAssistant, setIsAssistant] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: sponsor, error } = await supabase
          .from('sponsors')
          .select('*')
          .eq('id', user?.id)
          .single();

        if (error) throw error;

        if (sponsor) {
          setIsAssistant(sponsor.role === 'assistant' || sponsor.role === 'admin');
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    };

    if (user) {
      checkUser();
    }
  }, [user]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: sponsor } = await supabase
          .from('sponsors')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (sponsor) {
          setUser(sponsor);
          setIsAssistant(sponsor.role === 'assistant' || sponsor.role === 'admin');
          
          // Redirect based on role
          if (sponsor.role === 'sponsor' && window.location.pathname === '/login') {
            navigate('/sponsor-dashboard');
          } else if ((sponsor.role === 'assistant' || sponsor.role === 'admin') && window.location.pathname === '/login') {
            navigate('/dashboard');
          }
        }
      } else {
        setUser(null);
        if (window.location.pathname !== '/login' && 
            !window.location.pathname.startsWith('/') && 
            !window.location.pathname.startsWith('/public-donations') &&
            !window.location.pathname.startsWith('/children')) {
          navigate("/login");
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { data: sponsor } = await supabase
        .from('sponsors')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (sponsor) {
        setUser(sponsor);
        setIsAssistant(sponsor.role === 'assistant' || sponsor.role === 'admin');
        
        // Redirect based on role
        if (sponsor.role === 'sponsor') {
          navigate('/sponsor-dashboard');
        } else {
          navigate('/dashboard');
        }
        
        toast.success('Connexion réussie');
      }
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast.error(error.message || 'Erreur lors de la connexion');
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/login');
      toast.success('Déconnexion réussie');
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast.error(error.message || 'Erreur lors de la déconnexion');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAssistant, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};