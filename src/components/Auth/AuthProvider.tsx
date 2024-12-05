import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAssistant: boolean;
  session: any | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
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
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          
          // Verify if profile exists, if not create it
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', parsedUser.id)
            .single();
            
          if (profileError && profileError.code === 'PGRST116') {
            // Profile doesn't exist, create it
            const { error: createError } = await supabase
              .from('profiles')
              .insert([
                { 
                  id: parsedUser.id,
                  role: parsedUser.role || 'sponsor'
                }
              ]);
              
            if (createError) {
              console.error('Error creating profile:', createError);
              throw createError;
            }
          } else if (profileError) {
            console.error('Error checking profile:', profileError);
            throw profileError;
          }

          setUser(parsedUser);
          setIsAssistant(['assistant', 'admin'].includes(parsedUser.role));
          
          if (window.location.pathname === '/login') {
            if (parsedUser.role === 'admin' || parsedUser.role === 'assistant') {
              navigate('/dashboard');
            } else {
              navigate('/');
            }
          }
        } else {
          setUser(null);
          if (window.location.pathname !== '/login' && !window.location.pathname.startsWith('/')) {
            navigate("/login");
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password)
        .single();

      if (error) throw error;
      
      if (data) {
        // Create or update profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([
            { 
              id: data.id,
              role: data.role || 'sponsor'
            }
          ], { 
            onConflict: 'id',
            ignoreDuplicates: false 
          });
          
        if (profileError) {
          console.error('Error upserting profile:', profileError);
          throw profileError;
        }

        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        setIsAssistant(['assistant', 'admin'].includes(data.role));
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue !",
        });

        if (data.role === 'admin' || data.role === 'assistant') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error signing in:", error);
      toast({
        title: "Erreur de connexion",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

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
    <AuthContext.Provider value={{ user, loading, signIn, signOut, isAssistant, session: user }}>
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