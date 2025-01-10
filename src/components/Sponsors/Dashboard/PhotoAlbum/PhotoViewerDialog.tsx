import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PhotoViewerDialogProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const PhotoViewerDialog = ({ imageUrl, onClose }: PhotoViewerDialogProps) => {
  return (
    <Dialog open={!!imageUrl} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt="Photo en plein écran" 
            className="w-full h-auto"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};