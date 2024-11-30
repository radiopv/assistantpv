import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";

const SiteConfig = () => {
  const { toast } = useToast();
  const { user, isAssistant } = useAuth();
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    siteName: "Passion Varadero",
    primaryColor: "#FF6B6B",
    secondaryColor: "#4A90E2",
    logo: "",
  });

  useEffect(() => {
    // Redirect if not admin
    if (user && !isAssistant) {
      navigate("/");
      return;
    }

    // Load current config
    const loadConfig = async () => {
      try {
        // First try to get existing config
        const { data, error } = await supabase
          .from("site_config")
          .select("*")
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          setConfig({
            siteName: data[0].site_name,
            primaryColor: data[0].primary_color,
            secondaryColor: data[0].secondary_color,
            logo: data[0].logo_url || "",
          });
        } else {
          // If no config exists, create default one
          const { error: insertError } = await supabase
            .from("site_config")
            .insert({
              id: "default",
              site_name: config.siteName,
              primary_color: config.primaryColor,
              secondary_color: config.secondaryColor,
              logo_url: config.logo
            });

          if (insertError) throw insertError;
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger la configuration.",
        });
      }
    };

    loadConfig();
  }, [user, isAssistant, navigate]);

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("site_config")
        .upsert({
          id: "default",
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
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
      });
    }
  };

  if (!user || !isAssistant) {
    return null;
  }

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