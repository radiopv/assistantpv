import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface UploadStatusProps {
  status: 'success' | 'error' | null;
}

export const UploadStatus = ({ status }: UploadStatusProps) => {
  const { language } = useLanguage();
  const t = language === 'fr' ? {
    success: "Photos téléversées avec succès !",
    error: "Échec du téléversement, veuillez réessayer."
  } : {
    success: "¡Fotos subidas con éxito!",
    error: "Error al subir, por favor intente de nuevo."
  };

  if (!status) return null;

  return (
    <Alert variant={status === 'success' ? "default" : "destructive"} 
          className={status === 'success' ? "bg-green-50 border-green-200" : ""}>
      {status === 'success' ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <XCircle className="h-4 w-4" />
      )}
      <AlertDescription className={`ml-2 ${status === 'success' ? "text-green-600" : ""}`}>
        {status === 'success' ? t.success : t.error}
      </AlertDescription>
    </Alert>
  );
};