import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Home = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { data: featuredChildren, isLoading } = useQuery({
    queryKey: ['featured-children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('status', 'available')
        .limit(3);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-cover bg-center" style={{ backgroundImage: 'url(/lovable-uploads/c0c5a7da-df66-4f94-91c4-b5428f6fcc0d.png)' }}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t("changeLife")}</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            {t("giveHope")}
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/children')}
            className="bg-primary hover:bg-primary/90"
          >
            {t("sponsorChild")}
          </Button>
        </div>
      </section>

      {/* Featured Children Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t("childrenWaitingSponsorship")}</h2>
          
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredChildren?.map((child) => (
                <Card key={child.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={child.photo_url || "/placeholder.svg"}
                    alt={child.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{child.name}</h3>
                    <p className="text-gray-600 mb-4">
                      {child.age} {t("childAge")} • {child.city}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate(`/children/${child.id}`)}
                    >
                      {t("learnMore")}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Button 
              variant="outline"
              size="lg"
              onClick={() => navigate('/children')}
            >
              {t("seeAllChildren")}
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t("howItWorks")}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("chooseChild")}</h3>
              <p className="text-gray-600">{t("browseProfiles")}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("completeProfile")}</h3>
              <p className="text-gray-600">{t("fillInformation")}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("startSponsorship")}</h3>
              <p className="text-gray-600">{t("receiveUpdates")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">{t("readyToChange")}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t("sponsorshipDifference")}
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => navigate('/children')}
          >
            {t("startNow")}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;