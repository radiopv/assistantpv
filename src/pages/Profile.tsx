import { useAuth } from "@/components/Auth/AuthProvider";
import { Card } from "@/components/ui/card";

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profil</h1>
      
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-sm text-gray-500">Nom</h2>
            <p className="font-medium">{user.name}</p>
          </div>
          
          <div>
            <h2 className="text-sm text-gray-500">Email</h2>
            <p className="font-medium">{user.email}</p>
          </div>
          
          <div>
            <h2 className="text-sm text-gray-500">Rôle</h2>
            <p className="font-medium capitalize">{user.role}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;