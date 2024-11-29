import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "@/components/ErrorAlert";
import { ProfileHeader } from "@/components/Children/ProfileHeader";
import { ProfileDetails } from "@/components/Children/ProfileDetails";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Button } from "@/components/ui/button";

const ChildProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const handlePhotoUpdate = (url: string) => {
    setChild(prev => ({ ...prev, photo_url: url }));
  };

  // Si l'utilisateur n'est pas connecté, on affiche un bouton pour parrainer
  if (!user) {
    return (
      <div className="space-y-6">
        <ProfileHeader
          name={child?.name || ''}
          editing={false}
          onBack={() => navigate('/children')}
          onEdit={() => {}}
          onSave={() => {}}
          onDelete={() => {}}
          showEditButtons={false}
        />

        <Card className="p-6">
          <ProfileDetails
            child={child}
            editing={false}
            onChange={() => {}}
            onPhotoUpdate={() => {}}
          />
          
          <div className="mt-6">
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => navigate(`/become-sponsor?child=${id}`)}
            >
              Parrainer cet enfant
            </Button>
          </div>
        </Card>
      </div>
    );
  }

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
        showEditButtons={canEdit}
      />

      <ProfileDetails
        child={child}
        editing={editing}
        onChange={handleChange}
        onPhotoUpdate={handlePhotoUpdate}
      />
    </div>
  );
};

export default ChildProfile;