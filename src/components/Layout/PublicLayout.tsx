import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Navigation } from "@/components/Home/Navigation";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="sticky top-0 z-50 w-full bg-white border-b">
        <Navigation />
      </div>

      {/* Main Content */}
      <div className="pt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout;