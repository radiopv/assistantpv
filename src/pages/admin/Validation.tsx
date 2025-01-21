import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { TestimonialValidation } from "@/components/Validation/TestimonialValidation";
import { SponsorshipValidation } from "@/components/Validation/SponsorshipValidation";
import { PhotoValidation } from "@/components/Validation/PhotoValidation";
import { ChildAssignmentValidation } from "@/components/Validation/ChildAssignmentValidation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const ValidationPage = () => {
  const { t } = useLanguage();

  const { data: sponsorshipCount } = useQuery({
    queryKey: ['pending-sponsorship-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('sponsorship_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending') as { count: number };
      return count || 0;
    }
  });

  const { data: childRequestCount } = useQuery({
    queryKey: ['pending-child-requests-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('child_assignment_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending') as { count: number };
      return count || 0;
    }
  });

  const { data: photoCount } = useQuery({
    queryKey: ['pending-photo-count'],
    queryFn: async () => {
      console.log("Fetching photo count");
      const { count } = await supabase
        .from('album_media')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', false) as { count: number };
      console.log("Photo count:", count);
      return count || 0;
    }
  });

  const { data: testimonialCount } = useQuery({
    queryKey: ['pending-testimonial-count'],
    queryFn: async () => {
      console.log("Fetching testimonial count");
      const { count } = await supabase
        .from('temoignage')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', false) as { count: number };
      console.log("Testimonial count:", count);
      return count || 0;
    }
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">{t("validationPage")}</h1>
      
      <Tabs defaultValue="sponsorship" className="w-full">
        <TabsList className="relative">
          <div className="flex items-center">
            <TabsTrigger value="sponsorship" className="relative">
              {t("sponsorshipRequests")}
              {sponsorshipCount > 0 && (
                <Badge variant="destructive" className="absolute -top-3 -right-3 min-w-[20px] h-5 flex items-center justify-center">
                  {sponsorshipCount}
                </Badge>
              )}
            </TabsTrigger>
            
            <TabsTrigger value="children" className="relative">
              {t("childRequests")}
              {childRequestCount > 0 && (
                <Badge variant="destructive" className="absolute -top-3 -right-3 min-w-[20px] h-5 flex items-center justify-center">
                  {childRequestCount}
                </Badge>
              )}
            </TabsTrigger>
            
            <TabsTrigger value="photos" className="relative">
              {t("photoValidation")}
              {photoCount > 0 && (
                <Badge variant="destructive" className="absolute -top-3 -right-3 min-w-[20px] h-5 flex items-center justify-center">
                  {photoCount}
                </Badge>
              )}
            </TabsTrigger>
            
            <TabsTrigger value="testimonials" className="relative">
              {t("testimonialValidation")}
              {testimonialCount > 0 && (
                <Badge variant="destructive" className="absolute -top-3 -right-3 min-w-[20px] h-5 flex items-center justify-center">
                  {testimonialCount}
                </Badge>
              )}
            </TabsTrigger>
          </div>
        </TabsList>

        <TabsContent value="sponsorship">
          <Card className="p-4">
            <SponsorshipValidation />
          </Card>
        </TabsContent>

        <TabsContent value="children">
          <Card className="p-4">
            <ChildAssignmentValidation />
          </Card>
        </TabsContent>

        <TabsContent value="photos">
          <Card className="p-4">
            <PhotoValidation />
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