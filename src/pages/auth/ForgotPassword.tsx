import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { sendEmail } from "@/api/email";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Vérifier si l'email existe dans la base de données
      const { data: sponsor, error } = await supabase
        .from('sponsors')
        .select('id, email')
        .eq('email', email)
        .single();

      if (error || !sponsor) {
        throw new Error("Aucun compte trouvé avec cet email");
      }

      // Générer un token temporaire (vous pouvez ajuster la longueur)
      const tempPassword = Math.random().toString(36).slice(-8);

      // Mettre à jour le mot de passe dans la base de données
      const { error: updateError } = await supabase
        .from('sponsors')
        .update({ 
          password_hash: tempPassword,
          force_password_change: true
        })
        .eq('id', sponsor.id);

      if (updateError) throw updateError;

      // Envoyer l'email avec le mot de passe temporaire
      await sendEmail({
        to: [email],
        subject: "Réinitialisation de votre mot de passe",
        html: `
          <h2>Réinitialisation de votre mot de passe</h2>
          <p>Voici votre mot de passe temporaire : <strong>${tempPassword}</strong></p>
          <p>Veuillez vous connecter avec ce mot de passe temporaire. Vous serez invité à le changer lors de votre prochaine connexion.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, veuillez nous contacter immédiatement.</p>
        `
      });

      setSubmitted(true);
      toast({
        title: "Email envoyé",
        description: "Veuillez vérifier votre boîte de réception pour les instructions de réinitialisation",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
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
          <h1 className="text-2xl font-bold">Mot de passe oublié</h1>
          {!submitted ? (
            <p className="text-gray-600">
              Entrez votre adresse email pour recevoir les instructions de réinitialisation
            </p>
          ) : (
            <p className="text-gray-600">
              Si un compte existe avec cet email, vous recevrez les instructions de réinitialisation.
            </p>
          )}
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Envoi en cours..." : "Réinitialiser le mot de passe"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-green-600">
              Un email a été envoyé avec les instructions de réinitialisation.
            </p>
            <Button asChild className="w-full">
              <Link to="/login">Retour à la connexion</Link>
            </Button>
          </div>
        )}

        <div className="text-center">
          <Link 
            to="/login" 
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Retour à la connexion
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;