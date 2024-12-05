import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserCard } from "./Permissions/UserCard";

interface Permission {
  page: string;
  label: string;
  description: string;
}

const pagePermissions: Permission[] = [
  { page: "dashboard", label: "Dashboard", description: "Accès au tableau de bord" },
  { page: "children", label: "Enfants", description: "Accès à la liste des enfants" },
  { page: "children_needs", label: "Besoins des enfants", description: "Accès aux besoins des enfants" },
  { page: "donations", label: "Dons", description: "Accès aux dons" },
  { page: "media", label: "Médias", description: "Accès à la gestion des médias" },
  { page: "messages", label: "Messages", description: "Accès aux messages" },
  { page: "sponsor_space", label: "Espace Parrain", description: "Accès à l'espace parrain" },
];

const actionPermissions: Permission[] = [
  { page: "edit_children", label: "Modifier des enfants", description: "Autoriser la modification des enfants" },
  { page: "delete_children", label: "Supprimer des enfants", description: "Autoriser la suppression d'enfants" },
  { page: "edit_donations", label: "Modifier les dons", description: "Autoriser la modification des dons" },
  { page: "delete_donations", label: "Supprimer les dons", description: "Autoriser la suppression des dons" },
  { page: "edit_media", label: "Modifier les médias", description: "Autoriser la modification des médias" },
  { page: "delete_media", label: "Supprimer des médias", description: "Autoriser la suppression des médias" },
  { page: "view_sponsored_children", label: "Voir les enfants parrainés", description: "Autoriser la visualisation des enfants parrainés" },
];

export const AdminPermissions = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pages");
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .in('role', ['admin', 'assistant'])
        .order('role');
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const updateUserPermissions = async (userId: string, permissions: any) => {
    try {
      const { error } = await supabase
        .from('sponsors')
        .update({ permissions })
        .eq('id', userId);

      if (error) throw error;
      toast.success("Permissions mises à jour");
      await fetchUsers();
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error("Erreur lors de la mise à jour des permissions");
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('sponsors')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      toast.success("Utilisateur supprimé avec succès");
      setUserToDelete(null);
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error("Erreur lors de la suppression de l'utilisateur");
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Gestion des permissions</h2>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <div className="mt-6 grid gap-6">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              activeTab={activeTab}
              pagePermissions={pagePermissions}
              actionPermissions={actionPermissions}
              onUpdatePermissions={updateUserPermissions}
              onDeleteClick={(userId) => setUserToDelete(userId)}
            />
          ))}
        </div>
      </Tabs>

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToDelete && deleteUser(userToDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
