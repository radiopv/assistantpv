import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "@/hooks/useTranslations";

interface ProfileHeaderProps {
  name: string;
  editing: boolean;
  onBack: () => void;
  onEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export const ProfileHeader = ({ 
  name, 
  editing, 
  onBack, 
  onEdit, 
  onSave, 
  onDelete 
}: ProfileHeaderProps) => {
  const { t } = useTranslations();

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('back')}
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          {name}
        </h1>
      </div>
      <div className="flex gap-2">
        <Button 
          variant={editing ? "outline" : "default"}
          onClick={() => editing ? onSave() : onEdit()}
        >
          {editing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              {t('save')}
            </>
          ) : (
            t('edit')
          )}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              {t('delete')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('delete_child_confirmation_title')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('delete_child_confirmation_description')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                {t('delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};