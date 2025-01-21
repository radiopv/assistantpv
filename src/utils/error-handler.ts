import { PostgrestError } from "@supabase/supabase-js";
import { toast } from "sonner";

export const handleError = (error: unknown, customMessage?: string) => {
  console.error("Error details:", error);

  // Handle Supabase errors
  if (error instanceof PostgrestError) {
    const message = getSupabaseErrorMessage(error);
    toast.error(message);
    return;
  }

  // Handle network errors
  if (error instanceof TypeError && error.message === "Failed to fetch") {
    toast.error("Erreur de connexion. Veuillez vérifier votre connexion internet.");
    return;
  }

  // Handle other errors
  toast.error(customMessage || "Une erreur inattendue s'est produite");
};

const getSupabaseErrorMessage = (error: PostgrestError): string => {
  switch (error.code) {
    case "PGRST116":
      return "Erreur d'authentification. Veuillez vous reconnecter.";
    case "42501":
      return "Vous n'avez pas les permissions nécessaires pour cette action.";
    case "23505":
      return "Cette entrée existe déjà.";
    default:
      return `Erreur: ${error.message}`;
  }
};

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof TypeError && error.message === "Failed to fetch";
};