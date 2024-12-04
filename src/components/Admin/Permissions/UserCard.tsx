import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { PermissionsList } from "./PermissionsList";

interface UserCardProps {
  user: any;
  activeTab: string;
  pagePermissions: any[];
  actionPermissions: any[];
  onUpdatePermissions: (userId: string, permissions: any) => void;
  onDeleteClick: (userId: string) => void;
}

export const UserCard = ({
  user,
  activeTab,
  pagePermissions,
  actionPermissions,
  onUpdatePermissions,
  onDeleteClick,
}: UserCardProps) => (
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
          onClick={() => onDeleteClick(user.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>

    <TabsContent value="pages" className="mt-0">
      <PermissionsList
        permissions={pagePermissions}
        user={user}
        onUpdatePermissions={onUpdatePermissions}
      />
    </TabsContent>

    <TabsContent value="actions" className="mt-0">
      <PermissionsList
        permissions={actionPermissions}
        user={user}
        onUpdatePermissions={onUpdatePermissions}
      />
    </TabsContent>
  </Card>
);