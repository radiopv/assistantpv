import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { AuthContextType } from "./types";
import { useAuthHook } from "./useAuthHook";

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
  const {
    user,
    loading,
    isAssistant,
    signIn,
    signOut,
    checkAuth
  } = useAuthHook();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        
        if (currentSession?.user?.email) {
          await checkAuth(currentSession.user.email);
        } else {
          await checkAuth();
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event, newSession?.user?.email);
      setSession(newSession);
      
      if (event === 'SIGNED_IN' && newSession?.user?.email) {
        await checkAuth(newSession.user.email);
      } else if (event === 'SIGNED_OUT') {
        await checkAuth();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, session, isAssistant }}>
      {children}
    </AuthContext.Provider>
  );
};