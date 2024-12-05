import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useAuthHook = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAssistant, setIsAssistant] = useState(false);
  const navigate = useNavigate();

  const checkAuth = async (userEmail?: string) => {
    try {
      console.log('Checking auth for email:', userEmail);
      
      if (!userEmail) {
        // Try to get user from localStorage if no email provided
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAssistant(['assistant', 'admin'].includes(parsedUser.role));
        }
        setLoading(false);
        return;
      }

      const { data: sponsorData, error: sponsorError } = await supabase
        .from('sponsors')
        .select('*')
        .eq('email', userEmail)
        .single();

      if (sponsorError) {
        console.error('Error fetching sponsor:', sponsorError);
        throw sponsorError;
      }

      if (sponsorData) {
        console.log('Found sponsor data:', sponsorData);
        setUser(sponsorData);
        localStorage.setItem('user', JSON.stringify(sponsorData));
        setIsAssistant(['assistant', 'admin'].includes(sponsorData.role));
        
        if (window.location.pathname === '/login') {
          if (sponsorData.role === 'admin' || sponsorData.role === 'assistant') {
            navigate('/dashboard');
          } else {
            navigate('/');
          }
        }
      } else {
        console.log('No sponsor found for email:', userEmail);
        setUser(null);
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login' && !window.location.pathname.startsWith('/')) {
          navigate("/login");
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
      localStorage.removeItem('user');
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with:', { email });
      
      const { data: sponsorData, error: sponsorError } = await supabase
        .from('sponsors')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password)
        .single();

      if (sponsorError) {
        console.error('Error fetching sponsor:', sponsorError);
        throw sponsorError;
      }

      if (sponsorData) {
        console.log('Sign in successful:', sponsorData);
        setUser(sponsorData);
        localStorage.setItem('user', JSON.stringify(sponsorData));
        setIsAssistant(['assistant', 'admin'].includes(sponsorData.role));
        
        toast.success("Connexion réussie");

        if (sponsorData.role === 'admin' || sponsorData.role === 'assistant') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } else {
        console.log('Invalid credentials for:', email);
        toast.error("Email ou mot de passe incorrect");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Une erreur est survenue");
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      setIsAssistant(false);
      localStorage.removeItem('user');
      toast.success("Déconnexion réussie");
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return {
    user,
    loading,
    isAssistant,
    signIn,
    signOut,
    checkAuth
  };
};