import { toast } from "sonner";

export const handleSupabaseError = (error: any, context: string) => {
  console.error(`Supabase error in ${context}:`, error);

  // Handle specific error types
  if (error.code === 'PGRST301') {
    toast.error("Erreur d'authentification. Veuillez vous reconnecter.");
    return;
  }

  if (error.code === '23505') {
    toast.error("Cette entrée existe déjà.");
    return;
  }

  // Default error message
  toast.error("Une erreur est survenue. Veuillez réessayer.");
};

export const withErrorHandling = async (
  operation: () => Promise<any>,
  context: string
) => {
  try {
    return await operation();
  } catch (error) {
    handleSupabaseError(error, context);
    throw error;
  }
};