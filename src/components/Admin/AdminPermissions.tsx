import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
import { UserPermissionCard } from "./UserPermissionCard";
import { RolePermissions } from "./RolePermissions";
import { PageVisibility } from "./PageVisibility";

const pagePermissions = [
  { page: "dashboard", label: "Dashboard", description: "Accès au tableau de bord" },
  { page: "children", label: "Enfants", description: "Accès à la liste des enfants" },
  { page: "donations", label: "Dons", description: "Accès aux dons" },
  { page: "sponsorships", label: "Parrainages", description: "Accès aux parrainages" },
  { page: "media", label: "Médias", description: "Accès à la gestion des médias" },
];

const actionPermissions = [
  { page: "delete_children", label: "Supprimer des enfants", description: "Autoriser la suppression d'enfants" },
  { page: "edit_children", label: "Modifier des enfants", description: "Autoriser la modification des enfants" },
  { page: "delete_media", label: "Supprimer des médias", description: "Autoriser la suppression des médias" },
  { page: "edit_donations", label: "Modifier les dons", description: "Autoriser la modification des dons" },
  { page: "delete_donations", label: "Supprimer les dons", description: "Autoriser la suppression des dons" },
];

export const AdminPermissions = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .in('role', ['admin', 'assistant', 'sponsor'])
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
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="roles">Rôles</TabsTrigger>
          <TabsTrigger value="pages">Visibilité des pages</TabsTrigger>
        </TabsList>

        {activeTab === "users" && (
          <div className="mt-6 grid gap-6">
            {filteredUsers.map((user) => (
              <UserPermissionCard
                key={user.id}
                user={user}
                pagePermissions={pagePermissions}
                actionPermissions={actionPermissions}
                onUpdatePermissions={updateUserPermissions}
                onDeleteUser={() => setUserToDelete(user.id)}
              />
            ))}
          </div>
        )}

        {activeTab === "roles" && (
          <div className="mt-6">
            <RolePermissions />
          </div>
        )}

        {activeTab === "pages" && (
          <div className="mt-6">
            <PageVisibility />
          </div>
        )}
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