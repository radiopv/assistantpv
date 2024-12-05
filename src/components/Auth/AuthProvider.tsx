import { createContext, useContext, useEffect } from "react";
import { useAuthHook } from "./useAuthHook";
import type { Sponsor } from "@/types/auth";

interface AuthContextType {
  user: Sponsor | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAssistant: boolean;
  session: Sponsor | null;
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
    // Check auth on mount and when user email changes
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      checkAuth(parsedUser.email);
    } else {
      checkAuth(user?.email);
    }
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