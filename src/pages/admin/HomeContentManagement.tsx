import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ModulesList } from "@/components/Admin/HomeContent/Modules/ModulesList";
import { toast } from "sonner";
import { Module } from "@/components/Admin/HomeContent/types";

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

  const handleDragEnd = async (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    const reorderedModules = Array.from(modules);
    const [removed] = reorderedModules.splice(source.index, 1);
    reorderedModules.splice(destination.index, 0, removed);

    await Promise.all(
      reorderedModules.map((module, index) =>
        supabase
          .from("homepage_modules")
          .update({ order_index: index })
          .eq("id", module.id)
      )
    );

    toast.success("Modules réorganisés avec succès");
    refetch();
  };

  const handleSettingsClick = (module: Module) => {
    // Logic to open settings modal or navigate to settings page
    console.log("Settings clicked for module:", module);
  };

  const handleNewModuleClick = () => {
    // Logic to open new module creation modal
    console.log("New module creation clicked");
  };

  const handleToggle = async (moduleId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from("homepage_modules")
        .update({ is_active: !currentState })
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
          onDragEnd={handleDragEnd}
          onToggle={handleToggle}
          onSettingsClick={handleSettingsClick}
          onDeleteClick={handleDelete}
          onNewModuleClick={handleNewModuleClick}
        />
      </Card>
    </div>
  );
}
