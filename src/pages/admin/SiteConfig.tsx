import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const SiteConfig = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState({
    siteName: "Passion Varadero",
    primaryColor: "#FF6B6B",
    secondaryColor: "#4A90E2",
    logo: "",
  });

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("site_config")
        .upsert({
          key: "main", // Adding the required key field
          site_name: config.siteName,
          primary_color: config.primaryColor,
          secondary_color: config.secondaryColor,
          logo_url: config.logo,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Configuration sauvegardée",
        description: "Les modifications ont été enregistrées avec succès.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Configuration du Site</h1>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="siteName">Nom du Site</Label>
            <Input
              id="siteName"
              value={config.siteName}
              onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="primaryColor">Couleur Principale</Label>
            <div className="flex gap-2">
              <Input
                id="primaryColor"
                type="color"
                value={config.primaryColor}
                onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                className="w-20"
              />
              <Input
                value={config.primaryColor}
                onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="secondaryColor">Couleur Secondaire</Label>
            <div className="flex gap-2">
              <Input
                id="secondaryColor"
                type="color"
                value={config.secondaryColor}
                onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                className="w-20"
              />
              <Input
                value={config.secondaryColor}
                onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="logo">Logo</Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  // Handle logo upload
                }
              }}
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            Sauvegarder les modifications
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SiteConfig;