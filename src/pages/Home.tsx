import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">
          Passion Varadero
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Ensemble, changeons la vie des enfants cubains grâce au parrainage
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/become-sponsor">
            <Button>Devenir Parrain</Button>
          </Link>
          <Link to="/donations/public">
            <Button variant="outline">Faire un Don</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;