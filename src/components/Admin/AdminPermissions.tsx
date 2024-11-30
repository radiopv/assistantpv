import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
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

interface Permission {
  page: string;
  label: string;
  description: string;
}

const pagePermissions: Permission[] = [
  { page: "dashboard", label: "Dashboard", description: "Accès au tableau de bord" },
  { page: "children", label: "Enfants", description: "Accès à la liste des enfants" },
  { page: "donations", label: "Dons", description: "Accès aux dons" },
  { page: "sponsorships", label: "Parrainages", description: "Accès aux parrainages" },
  { page: "media", label: "Médias", description: "Accès à la gestion des médias" },
];

const actionPermissions: Permission[] = [
  { page: "delete_children", label: "Supprimer des enfants", description: "Autoriser la suppression d'enfants" },
  { page: "edit_children", label: "Modifier des enfants", description: "Autoriser la modification des enfants" },
  { page: "delete_media", label: "Supprimer des médias", description: "Autoriser la suppression des médias" },
  { page: "edit_donations", label: "Modifier les dons", description: "Autoriser la modification des dons" },
  { page: "delete_donations", label: "Supprimer les dons", description: "Autoriser la suppression des dons" },
];

const PermissionsList = ({ 
  permissions, 
  user, 
  onUpdatePermissions 
}: { 
  permissions: Permission[], 
  user: any, 
  onUpdatePermissions: (userId: string, permissions: any) => void 
}) => (
  <div className="space-y-4">
    {permissions.map((permission) => (
      <div key={permission.page} className="flex items-start space-x-3">
        <Checkbox
          id={`${user.id}-${permission.page}`}
          checked={user.permissions?.[permission.page] === true}
          onCheckedChange={(checked) => {
            const newPermissions = {
              ...user.permissions,
              [permission.page]: checked
            };
            onUpdatePermissions(user.id, newPermissions);
          }}
        />
        <div>
          <label
            htmlFor={`${user.id}-${permission.page}`}
            className="font-medium cursor-pointer"
          >
            {permission.label}
          </label>
          <p className="text-sm text-gray-600">{permission.description}</p>
        </div>
      </div>
    ))}
  </div>
);

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
            <Card key={user.id} className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0 items-center">
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                  <Badge variant={user.is_active ? 'default' : 'destructive'}>
                    {user.is_active ? 'Actif' : 'Inactif'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    onClick={() => setUserToDelete(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <TabsContent value="pages" className="mt-0">
                <PermissionsList
                  permissions={pagePermissions}
                  user={user}
                  onUpdatePermissions={updateUserPermissions}
                />
              </TabsContent>

              <TabsContent value="actions" className="mt-0">
                <PermissionsList
                  permissions={actionPermissions}
                  user={user}
                  onUpdatePermissions={updateUserPermissions}
                />
              </TabsContent>
            </Card>
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