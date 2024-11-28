import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/Auth/AuthProvider";

const Index = () => {
  const { session, loading } = useAuth();
  
  if (loading) {
    return <div>Chargement...</div>;
  }
  
  if (session) {
    return <Navigate to="/dashboard" />;
  }

  return <Navigate to="/login" />;
};

export default Index;