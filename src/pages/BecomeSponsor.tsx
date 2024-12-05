import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileDetails } from "@/components/Children/ProfileDetails";
import { Skeleton } from "@/components/ui/skeleton";
import { SponsorshipRequestForm } from "@/components/Sponsorship/SponsorshipRequestForm";

const BecomeSponsor = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const { data: child, isLoading: childLoading } = useQuery({
    queryKey: ['child', childId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('id', childId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('sponsorship_requests')
        .insert({
          ...formData,
          child_id: childId,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: t("success"),
        description: t("sponsorshipRequestSubmitted"),
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Error submitting request:', error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: error.message || t("errorSubmittingRequest"),
      });
    } finally {
      setLoading(false);
    }
  };

  if (childLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">{t("childNotFound")}</h1>
        <Button 
          onClick={() => navigate('/available-children')}
          className="mt-4"
        >
          {t("backToList")}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">{t("becomeSponsor")}</h1>
          <p className="text-gray-600">{t("sponsorshipDescription")}</p>
        </div>

        <Card className="p-6">
          <ProfileDetails
            child={child}
            editing={false}
            onChange={() => {}}
            onPhotoUpdate={() => {}}
          />
        </Card>

        <Card className="p-6">
          <SponsorshipRequestForm
            onSubmit={handleSubmit}
            loading={loading}
            translations={t}
          />
        </Card>
      </div>
    </div>
  );
};

export default BecomeSponsor;