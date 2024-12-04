import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ErrorAlert } from "@/components/ErrorAlert";
import { ProfileDetails } from "@/components/Children/ProfileDetails";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/Auth/AuthProvider";
import { LoadingState } from "@/components/ChildProfile/LoadingState";
import { ProfileHeader } from "@/components/ChildProfile/ProfileHeader";
import { ProfileActions } from "@/components/ChildProfile/ProfileActions";

const ChildProfile = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [child, setChild] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const { user } = useAuth();
  
  const canEdit = user?.role === 'admin' || user?.role === 'assistant';

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
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!canEdit) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires pour modifier ce profil.",
      });
      return;
    }

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
    if (!canEdit) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires pour supprimer ce profil.",
      });
      return;
    }

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

  const handleChange = (field: string, value: string) => {
    setChild(prev => ({ ...prev, [field]: value }));
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
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <ProfileHeader name={child.name} />
      
      <Card className="p-6">
        <ProfileDetails
          child={child}
          editing={editing}
          onChange={handleChange}
          onPhotoUpdate={(url) => handleChange('photo_url', url)}
        />
        
        <div className="mt-6">
          <ProfileActions
            childId={id}
            canEdit={canEdit}
            editing={editing}
            setEditing={setEditing}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
          />
        </div>
      </Card>
    </div>
  );
};

export default ChildProfile;