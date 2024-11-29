import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAssistant: boolean;
  isAdmin: boolean;
  session: any | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  isAssistant: false,
  isAdmin: false,
  session: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAssistant, setIsAssistant] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Fonction pour vérifier et mettre à jour le profil utilisateur
  const updateUserProfile = async (email: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('Erreur:', error);
      return null;
    }
  };

  // Gestion des changements d'authentification
  const handleAuthChange = async (session: any) => {
    try {
      if (session?.user) {
        const profile = await updateUserProfile(session.user.email);

        if (profile) {
          setUser(profile);
          setIsAssistant(profile.role === 'assistant' || profile.role === 'admin');
          setIsAdmin(profile.role === 'admin');

          // Redirection selon le rôle
          if (location.pathname === '/login') {
            if (profile.role === 'admin' || profile.role === 'assistant') {
              navigate('/admin/dashboard');
              toast({
                title: "Connexion réussie",
                description: `Bienvenue dans l'espace administration`,
              });
            } else if (profile.role === 'sponsor') {
              navigate('/sponsor-dashboard');
              toast({
                title: "Connexion réussie",
                description: "Bienvenue dans votre espace parrain",
              });
            } else {
              navigate('/');
              toast({
                title: "Connexion réussie",
                description: "Bienvenue",
              });
            }
          }
        }
      } else {
        // Réinitialisation des états si déconnecté
        setUser(null);
        setIsAssistant(false);
        setIsAdmin(false);

        // Redirection vers login si sur une page protégée
        const protectedPages = [
          '/admin',
          '/sponsor-dashboard',
          '/rewards',
          '/messages'
        ];

        if (protectedPages.some(page => location.pathname.startsWith(page))) {
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('Erreur de vérification auth:', error);
      toast({
        title: "Erreur d'authentification",
        description: "Une erreur est survenue, veuillez réessayer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Effet pour vérifier l'authentification initiale
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const profile = await updateUserProfile(user.email);
          if (profile) {
            handleAuthChange({ user: profile });
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification initiale:', error);
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthChange(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fonction de déconnexion
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAssistant(false);
      setIsAdmin(false);
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        title: "Erreur de déconnexion",
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