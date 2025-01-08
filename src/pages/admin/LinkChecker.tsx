import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LinkStatus {
  id: string;
  url: string;
  status: string;
  last_checked: string;
  source_page: string;
  error_message?: string;
}

const LinkChecker = () => {
  const { t } = useLanguage();
  const [links, setLinks] = useState<LinkStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('link_checker')
        .select('*')
        .order('last_checked', { ascending: false });

      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      console.error('Error fetching links:', error);
      toast.error(t("errorFetchingLinks"));
    } finally {
      setLoading(false);
    }
  };

  const checkLink = async (id: string) => {
    try {
      const { error } = await supabase
        .functions.invoke('check-link', {
          body: { linkId: id }
        });

      if (error) throw error;
      toast.success(t("linkCheckScheduled"));
      await fetchLinks(); // Refresh the list
    } catch (error) {
      console.error('Error checking link:', error);
      toast.error(t("errorCheckingLink"));
    }
  };

  if (loading) {
    return <div className="p-4">{t("loading")}</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">{t("linkChecker")}</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        {links.map((link) => (
          <Card key={link.id} className="p-4">
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
                  onClick={() => checkLink(link.id)}
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
        ))}
      </div>
    </div>
  );
};

export default LinkChecker;