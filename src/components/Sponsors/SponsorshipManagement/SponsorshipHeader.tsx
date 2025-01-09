import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SponsorshipHeaderProps {
  title: string;
  onLanguageChange: () => void;
}

export const SponsorshipHeader = ({ title, onLanguageChange }: SponsorshipHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Button
        variant="ghost"
        size="icon"
        onClick={onLanguageChange}
        className="w-9 px-0"
      >
        <Globe className="h-4 w-4" />
      </Button>
    </div>
  );
};