import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { TestimonialValidation } from "@/components/Validation/TestimonialValidation";
import { SponsorshipValidation } from "@/components/Validation/SponsorshipValidation";

const ValidationPage = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">{t("validationPage")}</h1>
      
      <Tabs defaultValue="sponsorship" className="w-full">
        <TabsList>
          <TabsTrigger value="sponsorship">{t("sponsorshipRequests")}</TabsTrigger>
          <TabsTrigger value="photos">{t("photoValidation")}</TabsTrigger>
          <TabsTrigger value="testimonials">{t("testimonialValidation")}</TabsTrigger>
        </TabsList>

        <TabsContent value="sponsorship">
          <Card className="p-4">
            <SponsorshipValidation />
          </Card>
        </TabsContent>

        <TabsContent value="photos">
          <Card className="p-4">
            <p className="text-center text-gray-500">{t("comingSoon")}</p>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials">
          <Card className="p-4">
            <TestimonialValidation />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ValidationPage;