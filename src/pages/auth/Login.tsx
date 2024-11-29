import { useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: sponsor, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;

      if (!sponsor) {
        throw new Error("Email ou mot de passe incorrect");
      }

      if (sponsor.password_hash !== password) {
        throw new Error("Email ou mot de passe incorrect");
      }

      localStorage.setItem('user', JSON.stringify(sponsor));

      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans votre espace",
      });
      
      // Redirection basée sur le rôle
      if (sponsor.role === 'admin' || sponsor.role === 'assistant') {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

    } catch (error: any) {
      let message = "Une erreur est survenue";
      if (error.message === "Email ou mot de passe incorrect") {
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
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary">Passion Varadero</h1>
          <p className="text-gray-600 mt-2">Connexion</p>
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
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;