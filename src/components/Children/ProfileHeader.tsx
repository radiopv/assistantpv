import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Pencil, Trash2 } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  editing: boolean;
  onBack: () => void;
  onEdit: () => void;
  onSave: () => void;
  onDelete?: () => void;
  userRole?: string;
}

export const ProfileHeader = ({
  name,
  editing,
  onBack,
  onEdit,
  onSave,
  onDelete,
  userRole
}: ProfileHeaderProps) => {
  // Only show edit/delete buttons if user has appropriate role
  const canEdit = userRole === 'admin' || userRole === 'assistant';
  const canDelete = userRole === 'admin' || userRole === 'assistant';
  
  // Check if we're on a public route
  const isPublicRoute = window.location.pathname.startsWith('/child-details/');

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">{name}</h1>
      </div>
      
      {!isPublicRoute && (
        <div className="flex gap-2">
          {editing ? (
            <Button onClick={onSave} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Enregistrer
            </Button>
          ) : canEdit && (
            <Button onClick={onEdit} variant="outline" className="flex items-center gap-2">
              <Pencil className="w-4 h-4" />
              Modifier
            </Button>
          )}
          
          {canDelete && !editing && onDelete && (
            <Button
              onClick={onDelete}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer
            </Button>
          )}
        </div>
      )}
    </div>
  );
};