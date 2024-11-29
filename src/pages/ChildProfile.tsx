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

const ChildProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [child, setChild] = useState<any>(null);
  const [editing, setEditing] = useState(false);

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
      setChild(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from('children')
        .update(child)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Les modifications ont été enregistrées avec succès.",
      });
      setEditing(false);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil.",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('children')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Enfant supprimé",
        description: "L'enfant a été supprimé avec succès.",
      });
      navigate('/children');
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'enfant.",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setChild(prev => ({ ...prev, [id]: value }));
  };

  const handlePhotoUpdate = (url: string) => {
    setChild(prev => ({ ...prev, photo_url: url }));
  };

  if (error) {
    return (
      <div className="space-y-6">
        <ErrorAlert 
          message="Une erreur est survenue lors du chargement du profil" 
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
        onDelete={handleDelete}
      />

      <div className="grid gap-6">
        <ProfileDetails
          child={child}
          editing={editing}
          onChange={handleChange}
          onPhotoUpdate={handlePhotoUpdate}
        />

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Photos de l'album parrain</h2>
          <p className="text-sm text-gray-500 mb-4">
            Ces photos seront visibles dans l'espace parrain. Elles permettent de partager des moments de la vie de l'enfant avec son parrain.
          </p>
          <div className="space-y-6">
            <AlbumMediaUpload childId={id!} onUploadComplete={loadChild} />
            <AlbumMediaGrid childId={id!} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChildProfile;