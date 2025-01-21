import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ModulesList } from "@/components/Admin/HomeContent/Modules/ModulesList";
import { toast } from "sonner";
import { Module, ModuleContent, ModuleSettings } from "@/types/module";

export default function HomeContentManagement() {
  const { data: modules = [], isLoading, refetch } = useQuery({
    queryKey: ["homepage-modules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_modules")
        .select("*")
        .order("order_index");

      if (error) throw error;

      return data as Module[];
    },
  });

  const handleAddModule = async (moduleData: Partial<Module>) => {
    try {
      const { error } = await supabase
        .from("homepage_modules")
        .insert([moduleData]);

      if (error) throw error;

      toast.success("Module ajouté avec succès");
      refetch();
    } catch (error) {
      console.error("Error adding module:", error);
      toast.error("Erreur lors de l'ajout du module");
    }
  };

  const handleToggle = async (moduleId: string) => {
    try {
      const moduleToUpdate = modules.find((m) => m.id === moduleId);
      if (!moduleToUpdate) return;

      const { error } = await supabase
        .from("homepage_modules")
        .update({ is_active: !moduleToUpdate.is_active })
        .eq("id", moduleId);

      if (error) throw error;

      toast.success("Module mis à jour avec succès");
      refetch();
    } catch (error) {
      console.error("Error toggling module:", error);
      toast.error("Erreur lors de la mise à jour du module");
    }
  };

  const handleDelete = async (moduleId: string) => {
    try {
      const { error } = await supabase
        .from("homepage_modules")
        .delete()
        .eq("id", moduleId);

      if (error) throw error;

      toast.success("Module supprimé avec succès");
      refetch();
    } catch (error) {
      console.error("Error deleting module:", error);
      toast.error("Erreur lors de la suppression du module");
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gestion du contenu de la page d'accueil</h1>
      <Card className="p-6">
        <ModulesList
          modules={modules}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onAddModule={handleAddModule}
        />
      </Card>
    </div>
  );
}