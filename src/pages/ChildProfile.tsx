import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/Auth/AuthProvider";

const ChildProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: child, isLoading } = useQuery({
    queryKey: ['child', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const handleDelete = async () => {
    try {
      // First delete associated sponsorships
      const { error: sponsorshipError } = await supabase
        .from('sponsorships')
        .delete()
        .match({ child_id: id });

      if (sponsorshipError) {
        console.error('Error deleting sponsorships:', sponsorshipError);
        throw sponsorshipError;
      }

      // Then delete the child
      const { error } = await supabase
        .from('children')
        .delete()
        .match({ id });

      if (error) {
        console.error('Error deleting child:', error);
        throw error;
      }

      toast({
        title: t("success"),
        description: t("childDeleteSuccess"),
      });
      navigate('/children');
    } catch (error) {
      console.error('Error deleting child:', error);
      toast({
        title: t("error"),
        description: t("childDeleteError"),
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!child) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{t("childNotFound")}</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{child.name}</h1>
        {user?.role === 'admin' && (
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            {t("deleteChild")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {child.photo_url && (
            <img
              src={child.photo_url}
              alt={child.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          )}
          <div className="space-y-2">
            <p><strong>{t("gender")}:</strong> {child.gender}</p>
            <p><strong>{t("age")}:</strong> {child.age}</p>
            <p><strong>{t("city")}:</strong> {child.city}</p>
            <p><strong>{t("status")}:</strong> {child.status}</p>
          </div>
        </div>

        <div className="space-y-4">
          {child.story && (
            <div>
              <h2 className="text-xl font-semibold mb-2">{t("story")}</h2>
              <p className="whitespace-pre-wrap">{child.story}</p>
            </div>
          )}
          {child.description && (
            <div>
              <h2 className="text-xl font-semibold mb-2">{t("description")}</h2>
              <p className="whitespace-pre-wrap">{child.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChildProfile;