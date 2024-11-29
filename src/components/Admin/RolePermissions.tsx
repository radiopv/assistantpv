import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/Auth/AuthProvider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface RolePermission {
  role: string;
  permission_id: string;
}

const roles = [
  { id: 'sponsor', label: 'Parrain', description: 'Utilisateurs qui parrainent des enfants' },
  { id: 'visitor', label: 'Invité', description: 'Utilisateurs non connectés' }
];

const permissionCategories = [
  { id: 'children', label: 'Enfants' },
  { id: 'donations', label: 'Dons' },
  { id: 'media', label: 'Médias' },
  { id: 'profile', label: 'Profil' },
  { id: 'messages', label: 'Messages' },
  { id: 'testimonials', label: 'Témoignages' }
];

export const RolePermissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [selectedRole, setSelectedRole] = useState('sponsor');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPermissions();
    }
  }, [user]);

  const fetchPermissions = async () => {
    try {
      const [permissionsResponse, rolePermissionsResponse] = await Promise.all([
        supabase.from('permissions').select('*'),
        supabase.from('role_permissions').select('*')
      ]);

      if (permissionsResponse.error) throw permissionsResponse.error;
      if (rolePermissionsResponse.error) throw rolePermissionsResponse.error;

      setPermissions(permissionsResponse.data || []);
      setRolePermissions(rolePermissionsResponse.data || []);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast.error("Erreur lors du chargement des permissions");
    } finally {
      setLoading(false);
    }
  };

  const updateRolePermission = async (permissionId: string, checked: boolean) => {
    try {
      if (!user) {
        toast.error("Vous devez être connecté pour effectuer cette action");
        return;
      }

      if (checked) {
        const { error } = await supabase
          .from('role_permissions')
          .insert({ 
            role: selectedRole, 
            permission_id: permissionId,
          })
          .select();
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('role_permissions')
          .delete()
          .match({ 
            role: selectedRole, 
            permission_id: permissionId 
          });
        
        if (error) throw error;
      }

      await fetchPermissions();
      toast.success("Permissions mises à jour");
    } catch (error) {
      console.error('Error updating role permission:', error);
      toast.error("Erreur lors de la mise à jour des permissions");
    }
  };

  const hasPermission = (permissionId: string) => {
    return rolePermissions.some(
      rp => rp.role === selectedRole && rp.permission_id === permissionId
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center p-4">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs value={selectedRole} onValueChange={setSelectedRole}>
        <TabsList>
          {roles.map(role => (
            <TabsTrigger key={role.id} value={role.id}>
              {role.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">
          Permissions pour {roles.find(r => r.id === selectedRole)?.label}
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          {roles.find(r => r.id === selectedRole)?.description}
        </p>

        <Accordion type="single" collapsible className="w-full">
          {permissionCategories.map(category => (
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger className="text-base font-medium">
                {category.label}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {permissions
                    .filter(permission => permission.category === category.id)
                    .map(permission => (
                      <div key={permission.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={`${selectedRole}-${permission.id}`}
                          checked={hasPermission(permission.id)}
                          onCheckedChange={(checked) => {
                            updateRolePermission(permission.id, checked as boolean);
                          }}
                        />
                        <div>
                          <label
                            htmlFor={`${selectedRole}-${permission.id}`}
                            className="font-medium cursor-pointer"
                          >
                            {permission.name}
                          </label>
                          <p className="text-sm text-gray-600">
                            {permission.description}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
};