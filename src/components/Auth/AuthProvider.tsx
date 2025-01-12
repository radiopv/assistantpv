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
        console.log("Vérification de l'authentification...");
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("Utilisateur trouvé dans le localStorage:", parsedUser);
          
          // Vérifier si l'utilisateur existe toujours dans la base de données
          const { data: sponsor, error: sponsorError } = await supabase
            .from('sponsors')
            .select('*')
            .eq('id', parsedUser.id)
            .maybeSingle();

          if (sponsorError) {
            console.error('Erreur lors de la vérification du sponsor:', sponsorError);
            throw sponsorError;
          }

          if (!sponsor) {
            console.error('Sponsor non trouvé dans la base de données');
            throw new Error('Sponsor non trouvé');
          }

          console.log("Définition du rôle utilisateur:", sponsor.role);
          setUser(sponsor);
          setIsAssistant(['assistant', 'admin'].includes(sponsor.role));
          
          // Gestion de la redirection en fonction du rôle et du chemin actuel
          const currentPath = window.location.pathname;
          if (currentPath === '/login' || currentPath === '/') {
            if (['admin', 'assistant'].includes(sponsor.role)) {
              navigate('/dashboard');
            } else {
              navigate('/sponsor-dashboard');
            }
          }
        } else {
          console.log("Aucun utilisateur trouvé dans le localStorage");
          localStorage.removeItem('user');
          setUser(null);
          const publicRoutes = ['/login', '/', '/available-children', '/public-donations', '/statistics', '/faq'];
          if (!publicRoutes.includes(window.location.pathname)) {
            navigate("/login");
          }
        }
      } catch (error) {
        console.error('Erreur dans checkAuth:', error);
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
      console.error("Erreur lors de la déconnexion:", error);
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