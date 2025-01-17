import { useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";

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

      if (!['admin', 'assistant', 'sponsor'].includes(sponsor.role)) {
        throw new Error("Accès non autorisé");
      }

      localStorage.setItem('user', JSON.stringify(sponsor));

      toast({
        title: "Connexion réussie",
        description: sponsor.role === 'sponsor' ? 
          "Bienvenue dans votre espace parrain" : 
          "Bienvenue dans l'espace administration",
      });
      
      if (['admin', 'assistant'].includes(sponsor.role)) {
        navigate("/dashboard");
      } else {
        navigate("/sponsor-dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-4 pt-12">
      <Card className="w-full max-w-md p-8 space-y-6 bg-white">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Espace Parrain</h1>
          <p className="text-gray-600">
            Connectez-vous pour accéder à votre espace parrain et :
          </p>
          <ul className="text-left text-gray-600 pl-4 mt-2 space-y-2">
            <li>• Suivre les enfants que vous parrainez</li>
            <li>• Consulter et partager des photos</li>
            <li>• Laisser des témoignages</li>
            <li>• Planifier vos visites</li>
            <li>• Voir les anniversaires à venir</li>
          </ul>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
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
            <Label htmlFor="password">Mot de passe</Label>
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

          <div className="flex justify-end">
            <Link 
              to="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Mot de passe oublié ?
            </Link>
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