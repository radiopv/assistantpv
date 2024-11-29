import { useAuth } from "@/components/Auth/AuthProvider";

export const usePermissions = () => {
  const { user } = useAuth();

  const hasRole = (requiredRole: string) => {
    if (!user) return false;
    return user.role === requiredRole || user.role === 'admin';
  };

  return {
    hasRole
  };
};