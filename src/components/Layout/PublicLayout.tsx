import { Link } from "react-router-dom";
import { 
  Home, 
  Heart, 
  HandHeart, 
  Video, 
  HelpCircle,
  BarChart
} from "lucide-react";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="container mx-auto p-4 flex justify-between">
          <Link to="/" className="flex items-center">
              <h2 className="text-2xl font-bold">Mon Application</h2>
          </Link>
          <div className="flex space-x-4">
            <Link to="/" className="flex items-center">
              <Home className="h-5 w-5" />
              <span>Accueil</span>
            </Link>
            <Link to="/stories" className="flex items-center">
              <Heart className="h-5 w-5" />
              <span>Histoires</span>
            </Link>
            <Link to="/donations" className="flex items-center">
              <HandHeart className="h-5 w-5" />
              <span>Dons</span>
            </Link>
            <Link to="/videos" className="flex items-center">
              <Video className="h-5 w-5" />
              <span>Vidéos</span>
            </Link>
            <Link to="/faq" className="flex items-center">
              <HelpCircle className="h-5 w-5" />
              <span>FAQ</span>
            </Link>
            <Link to="/stats" className="flex items-center">
              <BarChart className="h-5 w-5" />
              <span>Statistiques</span>
            </Link>
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
};

export default PublicLayout;
