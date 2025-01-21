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
      const { count } = await supabase
        .from('album_media')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', false) as { count: number };
      return count || 0;
    }
  });

  const { data: testimonialCount } = useQuery({
    queryKey: ['pending-testimonial-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('temoignage')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', false) as { count: number };
      return count || 0;
    }
  });

  return (
    <div className="container mx-auto py-4 px-2 md:py-8 md:px-4">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">{t("validationPage")}</h1>
      
      <Tabs defaultValue="sponsorship" className="w-full">
        <TabsList className="flex flex-col sm:flex-row w-full gap-2 bg-transparent h-auto p-0">
          <TabsTrigger 
            value="sponsorship" 
            className="w-full data-[state=active]:bg-cuba-coral data-[state=active]:text-white px-3 py-2 rounded-md text-sm md:text-base"
          >
            <span className="flex items-center gap-2">
              {t("sponsorshipRequests")}
              {sponsorshipCount > 0 && (
                <Badge variant="destructive" className="h-5 min-w-[20px] flex items-center justify-center">
                  {sponsorshipCount}
                </Badge>
              )}
            </span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="children" 
            className="w-full data-[state=active]:bg-cuba-coral data-[state=active]:text-white px-3 py-2 rounded-md text-sm md:text-base"
          >
            <span className="flex items-center gap-2">
              {t("childRequests")}
              {childRequestCount > 0 && (
                <Badge variant="destructive" className="h-5 min-w-[20px] flex items-center justify-center">
                  {childRequestCount}
                </Badge>
              )}
            </span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="photos" 
            className="w-full data-[state=active]:bg-cuba-coral data-[state=active]:text-white px-3 py-2 rounded-md text-sm md:text-base"
          >
            <span className="flex items-center gap-2">
              {t("photoValidation")}
              {photoCount > 0 && (
                <Badge variant="destructive" className="h-5 min-w-[20px] flex items-center justify-center">
                  {photoCount}
                </Badge>
              )}
            </span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="testimonials" 
            className="w-full data-[state=active]:bg-cuba-coral data-[state=active]:text-white px-3 py-2 rounded-md text-sm md:text-base"
          >
            <span className="flex items-center gap-2">
              {t("testimonialValidation")}
              {testimonialCount > 0 && (
                <Badge variant="destructive" className="h-5 min-w-[20px] flex items-center justify-center">
                  {testimonialCount}
                </Badge>
              )}
            </span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="sponsorship">
            <Card className="p-2 md:p-4">
              <SponsorshipValidation />
            </Card>
          </TabsContent>

          <TabsContent value="children">
            <Card className="p-2 md:p-4">
              <ChildAssignmentValidation />
            </Card>
          </TabsContent>

          <TabsContent value="photos">
            <Card className="p-2 md:p-4">
              <PhotoValidation />
            </Card>
          </TabsContent>

          <TabsContent value="testimonials">
            <Card className="p-2 md:p-4">
              <TestimonialValidation />
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ValidationPage;