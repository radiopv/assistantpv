import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Module, ModuleType } from "@/components/Admin/HomeContent/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ModuleCard } from "@/components/Admin/HomeContent/Modules/ModuleCard";

const HomeContentManagement = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("homepage_modules")
        .select("*");

      if (error) throw error;
      setModules(data);
    } catch (error) {
      console.error("Error fetching modules:", error);
      toast.error("Error fetching modules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleAddModule = async (moduleData: Omit<Module, 'id'>) => {
    try {
      const { error } = await supabase
        .from('homepage_modules')
        .insert({
          name: moduleData.name,
          module_type: moduleData.module_type,
          is_active: moduleData.is_active,
          content: moduleData.content,
          settings: moduleData.settings,
          order_index: moduleData.order_index
        });

      if (error) throw error;
      fetchModules();
    } catch (error) {
      console.error('Error adding module:', error);
      toast.error("Error adding module");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Gestion du contenu de la page d'accueil</h1>
      <Button onClick={() => handleAddModule({
        name: "Nouveau Module",
        module_type: "hero" as ModuleType,
        is_active: true,
        content: { title: "Titre", subtitle: "Sous-titre" },
        settings: { title: "Paramètres", buttonText: "Cliquez ici", buttonLink: "/", backgroundImage: "/path/to/image.jpg" },
        order_index: modules.length
      })}>
        Ajouter un module
      </Button>
      {loading ? (
        <p>Chargement des modules...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeContentManagement;
