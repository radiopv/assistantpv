import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Permission {
  page: string;
  label: string;
  description: string;
}

const availablePermissions: Permission[] = [
  { page: "dashboard", label: "Dashboard", description: "Accès au tableau de bord" },
  { page: "children", label: "Enfants", description: "Gestion des enfants" },
  { page: "donations", label: "Dons", description: "Gestion des dons" },
  { page: "sponsorships", label: "Parrainages", description: "Gestion des parrainages" },
];

export const AdminPermissions = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
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

  const hasPermission = (user: any, permission: string) => {
    return user.permissions?.[permission] === true;
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestion des permissions</h2>
      
      <div className="grid gap-6">
        {users.map((user) => (
          <Card key={user.id} className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email} - {user.role}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {availablePermissions.map((permission) => (
                <div key={permission.page} className="flex items-start space-x-3">
                  <Checkbox
                    id={`${user.id}-${permission.page}`}
                    checked={hasPermission(user, permission.page)}
                    onCheckedChange={(checked) => {
                      const newPermissions = {
                        ...user.permissions,
                        [permission.page]: checked
                      };
                      updateUserPermissions(user.id, newPermissions);
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
          </Card>
        ))}
      </div>
    </div>
  );
};