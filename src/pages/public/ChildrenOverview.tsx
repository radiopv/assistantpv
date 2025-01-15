import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AvailableChildren from "./AvailableChildren";
import SponsoredChildren from "./SponsoredChildren";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const ChildrenOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultTab = location.hash === "#sponsored" ? "sponsored" : "available";

  useEffect(() => {
    // Update URL hash when tab changes
    const hash = location.hash.replace("#", "");
    if (!hash) {
      navigate("#available", { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige to-white">
      <div className="container mx-auto px-4 py-12">
        <Tabs
          defaultValue={defaultTab}
          className="space-y-8"
          onValueChange={(value) => navigate(`#${value}`)}
        >
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-2 w-full max-w-[600px] h-14 bg-white/20 backdrop-blur-sm">
              <TabsTrigger
                value="available"
                className="data-[state=active]:bg-cuba-coral data-[state=active]:text-white text-lg font-semibold transition-all duration-300"
              >
                Enfants Disponibles
              </TabsTrigger>
              <TabsTrigger
                value="sponsored"
                className="data-[state=active]:bg-cuba-coral data-[state=active]:text-white text-lg font-semibold transition-all duration-300"
              >
                Enfants Parrainés
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="available" className="m-0">
            <AvailableChildren />
          </TabsContent>

          <TabsContent value="sponsored" className="m-0">
            <SponsoredChildren />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChildrenOverview;