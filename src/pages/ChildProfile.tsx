import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "@/components/ErrorAlert";
import { AlbumMediaGrid } from "@/components/AlbumMedia/AlbumMediaGrid";
import { ProfileHeader } from "@/components/Children/ProfileHeader";
import { ProfileDetails } from "@/components/Children/ProfileDetails";
import { Card } from "@/components/ui/card";
import { convertJsonToNeeds } from "@/types/needs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/components/Auth/AuthProvider";

const ChildProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [child, setChild] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadChild();
  }, [id]);

  const loadChild = async () => {
    try {
      const { data: userData } = await supabase
        .from('sponsors')
        .select('role')
        .eq('id', user?.id)
        .maybeSingle();

      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      const formattedChild = {
        ...data,
        needs: convertJsonToNeeds(data.needs)
      };
      
      setChild(formattedChild);
      // Only allow editing for admins and assistants
      setEditing(false);
    } catch (err: any) {
      console.error('Error loading child:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const { data: userData } = await supabase
        .from('sponsors')
        .select('role')
        .eq('id', user?.id)
        .maybeSingle();

      // Only allow updates for admins and assistants
      if (!userData || (userData.role !== 'admin' && userData.role !== 'assistant')) {
        toast({
          variant: "destructive",
          title: t("error"),
          description: t("unauthorizedAction"),
        });
        return;
      }

      const { error } = await supabase
        .from('children')
        .update({
          ...child,
          needs: child.needs
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: t("profileUpdated"),
        description: t("profileUpdateSuccess"),
      });
      setEditing(false);
      loadChild();
    } catch (err: any) {
      console.error('Error updating child:', err);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("profileUpdateError"),
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setChild(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpdate = (url: string) => {
    setChild(prev => ({ ...prev, photo_url: url }));
  };

  if (error) {
    return (
      <div className="space-y-6">
        <ErrorAlert 
          message={t("error")}
          retry={loadChild}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Card className="p-6">
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileHeader
        name={child.name}
        editing={editing}
        onBack={() => navigate('/children')}
        onEdit={() => {}} // Disable editing for sponsors
        onSave={handleUpdate}
        userRole={user?.role}
      />

      <div className="grid gap-6">
        <ProfileDetails
          child={child}
          editing={editing}
          onChange={handleChange}
          onPhotoUpdate={handlePhotoUpdate}
        />

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t("sponsorAlbum")}</h2>
          <p className="text-sm text-gray-500 mb-4">
            {t("sponsorAlbumDescription")}
          </p>
          <div className="space-y-6">
            <AlbumMediaGrid childId={id!} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChildProfile;