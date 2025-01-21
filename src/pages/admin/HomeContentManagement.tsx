import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ModulesList } from "@/components/Admin/HomeContent/Modules/ModulesList";
import { Module, ModuleType } from "@/components/Admin/HomeContent/types";
import { toast } from "sonner";

export default function HomeContentManagement() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_modules')
        .select('*')
        .order('order_index');

      if (error) throw error;

      const typedModules = data.map(module => ({
        ...module,
        module_type: module.module_type as ModuleType,
        content: module.content || {},
        settings: module.settings || {}
      }));

      setModules(typedModules);
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast.error("Erreur lors du chargement des modules");
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = async (moduleData: Partial<Module>) => {
    try {
      if (!moduleData.name || !moduleData.module_type) {
        throw new Error("Le nom et le type du module sont requis");
      }

      const { data, error } = await supabase
        .from('homepage_modules')
        .insert({
          name: moduleData.name,
          module_type: moduleData.module_type,
          is_active: moduleData.is_active ?? true,
          content: moduleData.content || {},
          settings: moduleData.settings || {},
          order_index: moduleData.order_index
        })
        .select()
        .single();

      if (error) throw error;

      setModules(prev => [...prev, data as Module]);
      toast.success("Module ajouté avec succès");
    } catch (error) {
      console.error('Error adding module:', error);
      toast.error("Erreur lors de l'ajout du module");
    }
  };

  const handleToggleModule = async (moduleId: string) => {
    try {
      const moduleToToggle = modules.find(module => module.id === moduleId);
      if (!moduleToToggle) return;

      const { data, error } = await supabase
        .from('homepage_modules')
        .update({ is_active: !moduleToToggle.is_active })
        .eq('id', moduleId)
        .select()
        .single();

      if (error) throw error;

      setModules(prev => prev.map(module => 
        module.id === moduleId ? { ...module, is_active: data.is_active } : module
      ));
      toast.success("Module mis à jour avec succès");
    } catch (error) {
      console.error('Error toggling module:', error);
      toast.error("Erreur lors de la mise à jour du module");
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    try {
      const { error } = await supabase
        .from('homepage_modules')
        .delete()
        .eq('id', moduleId);

      if (error) throw error;

      setModules(prev => prev.filter(module => module.id !== moduleId));
      toast.success("Module supprimé avec succès");
    } catch (error) {
      console.error('Error deleting module:', error);
      toast.error("Erreur lors de la suppression du module");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gestion du contenu de la page d'accueil</h1>
      <ModulesList
        modules={modules}
        onAddModule={handleAddModule}
        onToggle={handleToggleModule}
        onDeleteClick={handleDeleteModule}
      />
    </div>
  );
}