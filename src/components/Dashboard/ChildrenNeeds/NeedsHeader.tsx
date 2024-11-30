import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { translations } from "./translations";

interface NeedsHeaderProps {
  language: "fr" | "es";
  setLanguage: (lang: "fr" | "es") => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const NeedsHeader = ({ language, setLanguage, isOpen, setIsOpen }: NeedsHeaderProps) => {
  const t = translations[language];
  
  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      <h2 className="text-2xl font-semibold">{t.pageTitle}</h2>
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setLanguage(language === "fr" ? "es" : "fr")}
          className="flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          {language.toUpperCase()}
        </Button>
        <Button onClick={() => setIsOpen(!isOpen)}>
          {t.addNeed}
        </Button>
      </div>
    </div>
  );
};