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

interface DeleteUserDialogProps {
  userToDelete: string | null;
  onClose: () => void;
  onConfirm: (userId: string) => void;
}

export const DeleteUserDialog = ({ userToDelete, onClose, onConfirm }: DeleteUserDialogProps) => (
  <AlertDialog open={!!userToDelete} onOpenChange={onClose}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
        <AlertDialogDescription>
          Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Annuler</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => userToDelete && onConfirm(userToDelete)}
          className="bg-red-500 hover:bg-red-600"
        >
          Supprimer
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);