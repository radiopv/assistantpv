import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/Auth/AuthProvider";

const Index = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Chargement...</div>;
  }
  
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return <Navigate to="/" />;
};

export default Index;