import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: any;
  loading: boolean;
  isAssistant: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  isAssistant: false,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAssistant, setIsAssistant] = useState(false);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkAssistantRole(session?.user?.id);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      checkAssistantRole(session?.user?.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAssistantRole = async (userId: string | undefined) => {
    if (!userId) {
      setIsAssistant(false);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("sponsors")
        .select("role")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setIsAssistant(data?.role === "assistant");
    } catch (error) {
      console.error("Error checking assistant role:", error);
      setIsAssistant(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ session, loading, isAssistant, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};