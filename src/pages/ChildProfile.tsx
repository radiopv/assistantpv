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
  
  // Check if user is admin or assistant
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="space-y-6">
      <ProfileHeader
        name={child.name}
        editing={editing}
        onBack={() => navigate('/children')}
        onEdit={() => canEdit ? setEditing(true) : toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Vous n'avez pas les permissions nécessaires pour modifier ce profil.",
        })}
        onSave={handleUpdate}
        onDelete={handleDelete}
        showEditButtons={canEdit}
      />

      <div className="grid gap-6">
        <ProfileDetails
          child={child}
          editing={editing}
          onChange={handleChange}
          onPhotoUpdate={handlePhotoUpdate}
        />

        {canEdit && (
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
        )}
      </div>
    </div>
  );
};

export default ChildProfile;
