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
import { useLanguage } from "@/contexts/LanguageContext";

interface TransferConfirmationDialogProps {
  showDialog: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentSponsorName?: string;
}

export const TransferConfirmationDialog = ({
  showDialog,
  onClose,
  onConfirm,
  currentSponsorName = "",
}: TransferConfirmationDialogProps) => {
  const { t } = useLanguage();

  return (
    <AlertDialog open={showDialog} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("transferTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("transferDescription").replace("{sponsor}", currentSponsorName)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {t("confirmTransfer")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};