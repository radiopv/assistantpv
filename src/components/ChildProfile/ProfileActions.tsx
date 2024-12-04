import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileActionsProps {
  childId: string;
  canEdit: boolean;
  editing: boolean;
  setEditing: (editing: boolean) => void;
  handleUpdate: () => Promise<void>;
  handleDelete: () => Promise<void>;
}

export const ProfileActions = ({
  childId,
  canEdit,
  editing,
  setEditing,
  handleUpdate,
  handleDelete
}: ProfileActionsProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return (
      <Button 
        className="w-full" 
        size="lg"
        onClick={() => navigate(`/become-sponsor?child=${childId}`)}
      >
        Parrainer cet enfant
      </Button>
    );
  }

  if (!canEdit) return null;

  return (
    <div className="flex gap-2 justify-end">
      {editing ? (
        <>
          <Button variant="outline" onClick={() => setEditing(false)}>
            Annuler
          </Button>
          <Button onClick={handleUpdate}>
            Enregistrer
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" onClick={() => setEditing(true)}>
            Modifier
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Supprimer
          </Button>
        </>
      )}
    </div>
  );
};