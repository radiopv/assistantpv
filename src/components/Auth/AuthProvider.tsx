import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  session: Session | null;
  isAssistant: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  session: null,
  isAssistant: false,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session: authSession } } = await supabase.auth.getSession();
        setSession(authSession);
        
        if (authSession?.user) {
          const { data: sponsorData, error: sponsorError } = await supabase
            .from('sponsors')
            .select('*')
            .eq('id', authSession.user.id)
            .single();

          if (sponsorError) throw sponsorError;
          setUser(sponsorData);
        }
      } catch (error) {
        console.error('Error checking user session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, authSession) => {
      setSession(authSession);
      
      if (event === 'SIGNED_IN' && authSession?.user) {
        const { data: sponsorData, error: sponsorError } = await supabase
          .from('sponsors')
          .select('*')
          .eq('id', authSession.user.id)
          .single();

        if (sponsorError) throw sponsorError;
        setUser(sponsorData);
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const isAssistant = user?.role === 'assistant';

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, session, isAssistant }}>
      {children}
    </AuthContext.Provider>
  );
};