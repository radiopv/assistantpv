import { useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Lock } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, check if the user exists and has the correct role
      const { data: sponsor, error: sponsorError } = await supabase
        .from('sponsors')
        .select('*')
        .eq('email', email)
        .single();

      if (sponsorError || !sponsor) {
        throw new Error("Email ou mot de passe incorrect");
      }

      // Verify if user has the correct role
      if (!['assistant', 'admin', 'sponsor'].includes(sponsor.role)) {
        throw new Error("Accès non autorisé");
      }

      // Verify password
      if (sponsor.password_hash !== password) {
        throw new Error("Email ou mot de passe incorrect");
      }

      // Store user data
      localStorage.setItem('user', JSON.stringify(sponsor));

      toast({
        title: "Connexion réussie",
        description: `Bienvenue dans votre espace ${sponsor.role}`,
      });
      
      // Redirect based on role
      switch (sponsor.role) {
        case 'admin':
          navigate("/dashboard");
          break;
        case 'sponsor':
          navigate("/sponsor-dashboard");
          break;
        case 'assistant':
          navigate("/dashboard");
          break;
        default:
          navigate("/");
      }

    } catch (error: any) {
      let message = "Une erreur est survenue";
      if (error.message === "Accès non autorisé") {
        message = "Vous n'avez pas les droits d'accès nécessaires";
      } else if (error.message === "Email ou mot de passe incorrect") {
        message = "Email ou mot de passe incorrect";
      }
      
      toast({
        title: "Erreur de connexion",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Lock className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Connexion Sécurisée</h1>
          <p className="text-gray-600">Espace réservé aux parrains et assistants</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="votre@email.com"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;