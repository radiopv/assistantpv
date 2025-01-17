import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAssistant: boolean;
  session: Session | null;
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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAssistant, setIsAssistant] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      if (event === 'SIGNED_IN') {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch sponsor data
        const { data: sponsor, error: fetchError } = await supabase
          .from('sponsors')
          .select('*')
          .eq('id', session?.user?.id)
          .single();
        
        console.log("Sponsor data:", sponsor);
        console.log("Fetch error:", fetchError);

        if (sponsor) {
          setUser(sponsor);
          setIsAssistant(['assistant', 'admin'].includes(sponsor.role));
          
          // Redirect based on role
          if (window.location.pathname === '/login') {
            if (sponsor.role === 'admin' || sponsor.role === 'assistant') {
              navigate('/dashboard');
            } else {
              navigate('/');
            }
          }
        } else {
          // If no sponsor record exists, create one
          const { error: insertError } = await supabase
            .from('sponsors')
            .insert([
              { 
                id: session?.user?.id,
                email: session?.user?.email,
                role: 'sponsor',
                name: session?.user?.user_metadata?.full_name || session?.user?.email,
                is_active: true,
                show_name_publicly: false
              }
            ]);
          
          if (insertError) {
            console.error('Error creating sponsor record:', insertError);
            toast({
              title: "Erreur lors de la création du profil",
              description: "Veuillez réessayer ou contacter l'administrateur",
              variant: "destructive",
            });
          } else {
            // Fetch the newly created sponsor record
            const { data: newSponsor } = await supabase
              .from('sponsors')
              .select('*')
              .eq('id', session?.user?.id)
              .single();

            if (newSponsor) {
              setUser(newSponsor);
              navigate('/');
            }
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setIsAssistant(false);
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
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
    <AuthContext.Provider value={{ user, loading, signOut, isAssistant, session }}>
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