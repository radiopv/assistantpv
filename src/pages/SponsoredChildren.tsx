import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { SponsoredChildrenGrid } from "@/components/SponsoredChildren/SponsoredChildrenGrid";
import { Globe } from "lucide-react";

const SponsoredChildren = () => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="container mx-auto p-4 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">{t("sponsoredChildren")}</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLanguage(language === 'fr' ? 'es' : 'fr')}
          className="min-h-[44px] min-w-[44px]"
        >
          <Globe className="h-4 w-4" />
        </Button>
      </div>

      <SponsoredChildrenGrid />
    </div>
  );
};

export default SponsoredChildren;