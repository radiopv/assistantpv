import { Button } from "@/components/ui/button";

interface AutoTranslateProps {
  text: string;
  targetLanguage: 'fr' | 'es';
  onTranslationComplete: (translatedText: string) => void;
}

export const AutoTranslate = ({ text, targetLanguage, onTranslationComplete }: AutoTranslateProps) => {
  return (
    <Button 
      disabled
      variant="outline"
      size="sm"
      className="opacity-50"
    >
      Service temporairement indisponible
    </Button>
  );
};