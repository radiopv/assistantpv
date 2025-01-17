import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthError } from "@supabase/supabase-js";
import { ErrorAlert } from "@/components/ErrorAlert";
import { toast } from "@/components/ui/use-toast";

const Login = () => {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log("Initial session check:", { session, error });
      if (error) {
        console.error("Session check error:", error);
        setError("Erreur de connexion à la base de données. Veuillez réessayer dans quelques instants.");
        return;
      }
      if (session?.user?.id) handleUserSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", { event, session });
        if (event === "SIGNED_IN" && session?.user?.id) {
          handleUserSession(session);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleUserSession = async (session: any) => {
    try {
      console.log("Fetching user profile...");
      const { data: profile, error: fetchError } = await supabase
        .from("sponsors")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();
      
      console.log("Profile fetch result:", { profile, fetchError });

      if (fetchError) {
        console.error("Error fetching profile:", fetchError);
        setError("Erreur lors de la récupération du profil. Veuillez réessayer dans quelques instants.");
        return;
      }

      if (profile) {
        console.log("Existing profile found:", profile);
        if (profile.role === "admin" || profile.role === "assistant") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } else {
        console.log("Creating new sponsor profile...");
        const { data: newSponsor, error: insertError } = await supabase
          .from("sponsors")
          .insert([
            { 
              id: session.user.id,
              email: session.user.email,
              role: "sponsor",
              name: session.user.user_metadata?.full_name || session.user.email,
              is_active: true,
              show_name_publicly: false
            }
          ])
          .select()
          .maybeSingle();

        if (insertError) {
          console.error("Error creating sponsor record:", insertError);
          setError("Erreur lors de la création du profil. Veuillez réessayer dans quelques instants.");
          return;
        }

        if (newSponsor) {
          console.log("New sponsor created:", newSponsor);
          navigate("/");
        }
      }
    } catch (error: any) {
      console.error("Error in session handling:", error);
      setError("Une erreur est survenue lors de la connexion. Veuillez réessayer dans quelques instants.");
    }
  };

  const handleError = (error: AuthError) => {
    console.error("Auth error:", error);
    
    if (error.message.includes("Database error querying schema")) {
      setError("Erreur de connexion à la base de données. L'équipe technique a été notifiée. Veuillez réessayer dans quelques minutes.");
      toast({
        title: "Erreur technique",
        description: "Une erreur est survenue avec la base de données. Nous travaillons à résoudre ce problème.",
        variant: "destructive",
      });
      return;
    }
    
    switch (error.message) {
      case "Invalid login credentials":
        setError("Email ou mot de passe incorrect");
        break;
      case "Email not confirmed":
        setError("Veuillez confirmer votre email avant de vous connecter");
        break;
      case "Email logins are disabled":
        setError("La connexion par email est temporairement désactivée. Veuillez contacter l'administrateur.");
        break;
      default:
        setError("Une erreur est survenue. Veuillez réessayer dans quelques instants.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cuba-deepOrange mb-2">
            Bienvenue
          </h1>
          <p className="text-gray-600">
            Connectez-vous pour accéder à votre espace
          </p>
        </div>

        {error && (
          <ErrorAlert message={error} />
        )}

        <div className="bg-white p-6 rounded-lg shadow-md border border-cuba-softOrange/20">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#FF6B6B',
                    brandAccent: '#FF5252',
                  },
                },
              },
            }}
            providers={[]}
            redirectTo="https://touspourcuba.lovable.app/login"
            localization={{
              variables: {
                sign_in: {
                  email_label: "Email",
                  password_label: "Mot de passe",
                  button_label: "Se connecter",
                  loading_button_label: "Connexion en cours...",
                  social_provider_text: "Continuer avec {{provider}}",
                  link_text: "Vous avez déjà un compte ? Connectez-vous",
                },
                sign_up: {
                  email_label: "Email",
                  password_label: "Mot de passe",
                  button_label: "S'inscrire",
                  loading_button_label: "Inscription en cours...",
                  social_provider_text: "S'inscrire avec {{provider}}",
                  link_text: "Vous n'avez pas de compte ? Inscrivez-vous",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;