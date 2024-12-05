import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "@/components/ErrorAlert";
import { AlbumMediaUpload } from "@/components/AlbumMedia/AlbumMediaUpload";
import { AlbumMediaGrid } from "@/components/AlbumMedia/AlbumMediaGrid";
import { ProfileHeader } from "@/components/Children/ProfileHeader";
import { ProfileDetails } from "@/components/Children/ProfileDetails";
import { Card } from "@/components/ui/card";
import { convertJsonToNeeds } from "@/types/needs";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ChildProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [child, setChild] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    loadChild();
  }, [id]);

  const loadChild = async () => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      const formattedChild = {
        ...data,
        needs: convertJsonToNeeds(data.needs)
      };
      
      setChild(formattedChild);
    } catch (err: any) {
      console.error('Error loading child:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      console.log("Updating child with needs:", child.needs);
      
      const { error } = await supabase
        .from('children')
        .update({
          ...child,
          needs: child.needs
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating child:', error);
        throw error;
      }

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

  const handleDelete = async () => {
    try {
      // First, delete related records in album_media
      const { error: albumError } = await supabase
        .from('album_media')
        .delete()
        .eq('child_id', id);

      if (albumError) {
        console.error('Error deleting album media:', albumError);
        throw albumError;
      }

      // Then delete the child record
      const { error } = await supabase
        .from('children')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting child:', error);
        throw error;
      }

      toast({
        title: t("childDeleted"),
        description: t("childDeleteSuccess"),
      });
      navigate('/children');
    } catch (err: any) {
      console.error('Error in deletion process:', err);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("childDeleteError"),
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
        onEdit={() => setEditing(true)}
        onSave={handleUpdate}
        onDelete={() => setShowDeleteDialog(true)}
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
            <AlbumMediaUpload childId={id!} onUploadComplete={loadChild} />
            <AlbumMediaGrid childId={id!} />
          </div>
        </Card>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmDeleteChild")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirmDeleteChildDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChildProfile;