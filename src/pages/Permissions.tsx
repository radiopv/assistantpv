import { AdminPermissions } from "@/components/Admin/AdminPermissions";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Navigate } from "react-router-dom";

const Permissions = () => {
  const { user } = useAuth();

  // Only admin can access this page
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container mx-auto py-8">
      <AdminPermissions />
    </div>
  );
};

export default Permissions;