import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Link } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Passion Varadero
          </h1>
          <p className="text-xl mb-8">
            Ensemble, changeons la vie des enfants cubains grâce au parrainage
          </p>
          <div className="space-y-4">
            <div>
              <Link to="/become-sponsor" className="text-blue-600 hover:underline">
                Devenir Parrain
              </Link>
            </div>
            <div>
              <Link to="/donations/public" className="text-blue-600 hover:underline">
                Faire un Don
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;