import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Attempting login with email:", email);
      
      // Direct query to sponsors table
      const { data: sponsor, error: sponsorError } = await supabase
        .from('sponsors')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password)
        .maybeSingle();

      if (sponsorError) {
        console.error("Error fetching sponsor:", sponsorError);
        throw sponsorError;
      }

      if (!sponsor) {
        throw new Error("Email ou mot de passe incorrect");
      }

      console.log("Sponsor found:", sponsor);

      // Update last_login timestamp
      const { error: updateError } = await supabase
        .from('sponsors')
        .update({ last_login: new Date().toISOString() })
        .eq('id', sponsor.id);

      if (updateError) {
        console.error('Error updating last_login:', updateError);
      }
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(sponsor));

      toast({
        title: "Connexion réussie",
        description: "Bienvenue !",
      });

      // Role-based redirection
      if (['admin', 'assistant'].includes(sponsor.role)) {
        navigate('/dashboard');
      } else {
        navigate('/sponsor-dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
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