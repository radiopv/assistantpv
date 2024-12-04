import { Checkbox } from "@/components/ui/checkbox";

interface Permission {
  page: string;
  label: string;
  description: string;
}

interface PermissionsListProps {
  permissions: Permission[];
  user: any;
  onUpdatePermissions: (userId: string, permissions: any) => void;
}

export const PermissionsList = ({ permissions, user, onUpdatePermissions }: PermissionsListProps) => (
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