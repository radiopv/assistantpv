import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-xl text-gray-600">Page non trouvée</p>
        <Button onClick={() => navigate("/")}>
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
};

export default NotFound;