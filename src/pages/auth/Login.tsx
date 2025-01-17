import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError } from "@supabase/supabase-js";

const Login = () => {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change event:", event);
        console.log("Session:", session);

        if (event === "SIGNED_IN" && session?.user?.id) {
          try {
            const { data: profile, error: fetchError } = await supabase
              .from("sponsors")
              .select("*")
              .eq("id", session.user.id)
              .maybeSingle();
            
            console.log("Profile data:", profile);
            console.log("Fetch error:", fetchError);

            if (fetchError) {
              console.error("Error fetching profile:", fetchError);
              
              // Si le profil n'existe pas, on le crée
              if (fetchError.code === 'PGRST116') {
                const { data: newSponsor, error: insertError } = await supabase
                  .from('sponsors')
                  .insert([
                    { 
                      id: session.user.id,
                      email: session.user.email,
                      role: 'sponsor',
                      name: session.user.user_metadata?.full_name || session.user.email,
                      is_active: true,
                      show_name_publicly: false
                    }
                  ])
                  .select()
                  .maybeSingle();
                
                if (insertError) {
                  console.error('Error creating sponsor record:', insertError);
                  setError("Erreur lors de la création du profil");
                  return;
                }
                
                if (newSponsor) {
                  console.log("New sponsor created:", newSponsor);
                  navigate('/');
                  return;
                }
              }
              
              setError("Erreur lors de la récupération du profil");
              return;
            }

            if (profile?.role === "admin" || profile?.role === "assistant") {
              navigate("/dashboard");
            } else {
              navigate("/");
            }
          } catch (error: any) {
            console.error("Error in auth state change:", error);
            setError("Une erreur est survenue lors de la connexion");
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleError = (error: AuthError) => {
    console.error("Auth error:", error);
    
    switch (error.message) {
      case "Invalid login credentials":
        setError("Email ou mot de passe incorrect");
        break;
      case "Email not confirmed":
        setError("Veuillez confirmer votre email avant de vous connecter");
        break;
      case "Database error querying schema":
        setError("Erreur de connexion à la base de données. Veuillez réessayer dans quelques instants.");
        break;
      default:
        setError(error.message);
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
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
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