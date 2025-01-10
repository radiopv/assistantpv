import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface LinkCheckerCardProps {
  link: {
    id: string;
    url: string;
    status: string;
    last_checked: string;
    source_page: string;
    error_message?: string;
  };
  onCheckComplete: () => void;
}

export const LinkCheckerCard = ({ link, onCheckComplete }: LinkCheckerCardProps) => {
  const { t } = useLanguage();

  const checkLink = async () => {
    try {
      const { error } = await supabase
        .functions.invoke('check-link', {
          body: { linkId: link.id }
        });

      if (error) throw error;
      toast.success(t("linkCheckScheduled"));
      onCheckComplete();
    } catch (error) {
      console.error('Error checking link:', error);
      toast.error(t("errorCheckingLink"));
    }
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-start">
          <div className="break-all">
            <a 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {link.url}
            </a>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkLink}
          >
            {t("checkNow")}
          </Button>
        </div>
        
        <div className="text-sm text-gray-500">
          {t("sourcePage")}: {link.source_page}
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className={`px-2 py-1 rounded-full ${
            link.status === 'ok' ? 'bg-green-100 text-green-800' :
            link.status === 'error' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {link.status}
          </span>
          <span>
            {t("lastChecked")}: {new Date(link.last_checked).toLocaleString()}
          </span>
        </div>
        
        {link.error_message && (
          <div className="text-sm text-red-500 mt-2">
            {link.error_message}
          </div>
        )}
      </div>
    </Card>
  );
};