import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PageConfig {
  id: string;
  page_id: string;
  is_visible: boolean;
  required_role: string;
}

const defaultPages = [
  { id: "home", name: "Accueil", is_visible: true, required_role: "public" },
  { id: "children", name: "Enfants", is_visible: true, required_role: "public" },
  { id: "sponsorships", name: "Parrainages", is_visible: true, required_role: "public" },
  { id: "donations", name: "Dons", is_visible: true, required_role: "public" },
  { id: "about", name: "À propos", is_visible: true, required_role: "public" },
  { id: "contact", name: "Contact", is_visible: true, required_role: "public" },
  { id: "dashboard", name: "Tableau de bord", is_visible: true, required_role: "assistant" },
  { id: "admin", name: "Administration", is_visible: true, required_role: "admin" },
];

export const PageVisibility = () => {
  const [pages, setPages] = useState<PageConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageConfigs();
  }, []);

  const fetchPageConfigs = async () => {
    try {
      const { data: existingConfigs, error } = await supabase
        .from('page_config')
        .select('*');
      
      if (error) throw error;
      
      // If we have data, use it; otherwise use default pages
      const configuredPages = existingConfigs?.length ? existingConfigs : defaultPages.map(page => ({
        id: page.id,
        page_id: page.id,
        is_visible: page.is_visible,
        required_role: page.required_role
      }));
      
      setPages(configuredPages);
    } catch (error) {
      console.error('Error fetching page configurations:', error);
      toast.error("Erreur lors du chargement des configurations");
    } finally {
      setLoading(false);
    }
  };

  const updatePageConfig = async (pageId: string, field: 'is_visible' | 'required_role', value: boolean | string) => {
    try {
      const { error } = await supabase
        .from('page_config')
        .upsert({
          page_id: pageId,
          [field]: value,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setPages(pages.map(page => 
        page.page_id === pageId ? { ...page, [field]: value } : page
      ));
      
      toast.success("Configuration mise à jour");
    } catch (error) {
      console.error('Error updating page configuration:', error);
      toast.error("Erreur lors de la mise à jour de la configuration");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {defaultPages.map((defaultPage) => {
          const page = pages.find(p => p.page_id === defaultPage.id) || defaultPage;
          return (
            <Card key={defaultPage.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{defaultPage.name}</h3>
                  <p className="text-sm text-gray-500">
                    Gérez la visibilité et les permissions d'accès
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`visibility-${defaultPage.id}`}
                      checked={page.is_visible}
                      onCheckedChange={(checked) => 
                        updatePageConfig(defaultPage.id, 'is_visible', checked)
                      }
                    />
                    <Label htmlFor={`visibility-${defaultPage.id}`}>Visible</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label>Accès requis:</Label>
                    <Select
                      value={page.required_role}
                      onValueChange={(value) => 
                        updatePageConfig(defaultPage.id, 'required_role', value)
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="sponsor">Parrain</SelectItem>
                        <SelectItem value="assistant">Assistant</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};