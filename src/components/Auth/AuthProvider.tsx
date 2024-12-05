import { createContext, useContext, useEffect } from "react";
import { useAuthHook } from "./useAuthHook";

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
  const { user, loading, isAssistant, signIn, signOut, checkAuth } = useAuthHook();

  useEffect(() => {
    checkAuth(user?.email);
  }, [user?.email]);

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