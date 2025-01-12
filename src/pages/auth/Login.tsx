import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, UserCheck } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Tentative de connexion avec l'email:", email);
      
      const { data: sponsor, error: sponsorError } = await supabase
        .from('sponsors')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password)
        .maybeSingle();

      if (sponsorError) {
        console.error("Erreur lors de la récupération du sponsor:", sponsorError);
        throw new Error("Erreur de connexion");
      }

      if (!sponsor) {
        throw new Error("Email ou mot de passe incorrect");
      }

      console.log("Sponsor trouvé:", sponsor);

      // Mise à jour de last_login
      const { error: updateError } = await supabase
        .from('sponsors')
        .update({ last_login: new Date().toISOString() })
        .eq('id', sponsor.id);

      if (updateError) {
        console.error('Erreur lors de la mise à jour de last_login:', updateError);
      }

      // Stockage des données utilisateur
      localStorage.setItem('user', JSON.stringify(sponsor));

      const icon = sponsor.role === 'admin' ? <Shield className="w-4 h-4 mr-2" /> : <UserCheck className="w-4 h-4 mr-2" />;
      
      toast({
        title: "Connexion réussie",
        description: (
          <div className="flex items-center">
            {icon}
            <span>Bienvenue {sponsor.name} !</span>
          </div>
        ),
      });

      // Redirection basée sur le rôle
      if (['admin', 'assistant'].includes(sponsor.role)) {
        console.log("Redirection vers le dashboard admin");
        navigate('/dashboard');
      } else {
        console.log("Redirection vers le dashboard parrain");
        navigate('/sponsor-dashboard');
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      toast({
        title: "Erreur de connexion",
        description: error.message || "Email ou mot de passe incorrect",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-8">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
          Connexion
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
              placeholder="votre@email.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
              placeholder="Votre mot de passe"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>
      </Card>
    </div>
  );
}