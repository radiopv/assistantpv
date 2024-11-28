import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt!",
      });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Erreur lors de la déconnexion",
        description: "Veuillez réessayer",
        variant: "destructive",
      });
    }
  };

  return { logout };
};