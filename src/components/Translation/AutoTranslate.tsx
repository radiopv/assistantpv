import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AutoTranslateProps {
  text: string;
  targetLanguage: 'fr' | 'es';
  onTranslationComplete: (translatedText: string) => void;
}

export const AutoTranslate = ({ text, targetLanguage, onTranslationComplete }: AutoTranslateProps) => {
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('grok-ai', {
        body: {
          prompt: `Translate the following text to ${targetLanguage === 'fr' ? 'French' : 'Spanish'}, keep the same tone and meaning: "${text}"`
        }
      });

      if (error) throw error;

      if (data.response) {
        onTranslationComplete(data.response);
        toast.success("Traduction effectuée avec succès");
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast.error("Erreur lors de la traduction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleTranslate} 
      disabled={loading}
      variant="outline"
      size="sm"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Traduction en cours...
        </>
      ) : (
        "Traduire automatiquement"
      )}
    </Button>
  );
};