import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageList } from "@/components/Messages/MessageList";
import Login from "@/pages/auth/Login";

const Index = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold text-center mb-8 text-primary">
            ASSISTANT PV
          </h1>
          <Login />
        </div>
      </div>
    );
  }

  if (user.role === 'admin' || user.role === 'assistant') {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold text-center text-primary">
          ASSISTANT PV
        </h1>
        
        <Card className="max-w-4xl mx-auto">
          <div className="p-4">
            <MessageList onSelectMessage={() => {}} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;