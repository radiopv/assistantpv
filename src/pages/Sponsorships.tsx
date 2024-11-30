import { useState } from "react";
import { SponsorshipList } from "@/components/Sponsorship/SponsorshipList";
import { SponsorshipStats } from "@/components/Sponsorship/SponsorshipStats";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { translations } from "@/components/Sponsorship/translations";

const Sponsorships = () => {
  const [language, setLanguage] = useState<"fr" | "es">("fr");

  const toggleLanguage = () => {
    setLanguage(prev => prev === "fr" ? "es" : "fr");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{translations[language].pageTitle}</h2>
        <Button variant="ghost" size="icon" onClick={toggleLanguage}>
          <Globe className="h-5 w-5" />
        </Button>
      </div>
      <SponsorshipStats language={language} />
      <SponsorshipList language={language} />
    </div>
  );
};

export default Sponsorships;