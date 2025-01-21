import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PhotoAnalysisProps {
  imageUrl: string;
  onAnalysisComplete: (analysis: string) => void;
}

export const PhotoAnalysis = ({ imageUrl, onAnalysisComplete }: PhotoAnalysisProps) => {
  const [loading, setLoading] = useState(false);

  const analyzePhoto = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('grok-ai', {
        body: {
          prompt: `Analyze this photo and provide a detailed description in French. The photo URL is: ${imageUrl}. Please describe: 
          1. What is visible in the photo
          2. The overall mood or atmosphere
          3. Any notable details that might be important
          4. Suggestions for improving the photo quality if needed`
        }
      });

      if (error) throw error;

      if (data.response) {
        onAnalysisComplete(data.response);
        toast.success("Analyse de la photo terminée");
      }
    } catch (error) {
      console.error('Photo analysis error:', error);
      toast.error("Erreur lors de l'analyse de la photo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={analyzePhoto} 
      disabled={loading}
      variant="outline"
      size="sm"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Analyse en cours...
        </>
      ) : (
        <>
          <Search className="h-4 w-4 mr-2" />
          Analyser la photo
        </>
      )}
    </Button>
  );
};