import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
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
        setIsAssistant(['assistant', 'admin'].includes(sponsorData.role));
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue !",
        });

        if (sponsorData.role === 'admin' || sponsorData.role === 'assistant') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } else {
        console.log('Invalid credentials for:', email);
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

  return {
    user,
    loading,
    isAssistant,
    signIn,
    signOut,
    checkAuth
  };
};