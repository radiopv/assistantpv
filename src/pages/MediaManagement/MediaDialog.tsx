import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageCropDialog } from "@/components/ImageCrop/ImageCropDialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MediaDialogProps {
  open: boolean;
  onClose: () => void;
  media: any;
  onSave: () => void;
}

export const MediaDialog = ({ open, onClose, media, onSave }: MediaDialogProps) => {
  const [editedMedia, setEditedMedia] = useState(media);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setShowCropDialog(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from(media.source_table)
        .update({
          title: editedMedia.title,
          description: editedMedia.description
        })
        .eq('id', media.id);

      if (error) throw error;

      toast({
        title: "Média modifié",
        description: "Les modifications ont été enregistrées avec succès.",
      });

      onSave();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification.",
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le média</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={editedMedia.title || ''}
                onChange={(e) => setEditedMedia({...editedMedia, title: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editedMedia.description || ''}
                onChange={(e) => setEditedMedia({...editedMedia, description: e.target.value})}
              />
            </div>
            {media.type === 'image' && (
              <div>
                <Label htmlFor="new-image">Nouvelle image</Label>
                <Input
                  id="new-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button onClick={handleSave}>
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ImageCropDialog
        open={showCropDialog}
        onClose={() => setShowCropDialog(false)}
        imageSrc={selectedImage}
        onCropComplete={async (croppedImageBlob) => {
          try {
            const fileExt = "jpg";
            const filePath = `${media.id}/${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
              .from(media.source_table)
              .upload(filePath, croppedImageBlob);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
              .from(media.source_table)
              .getPublicUrl(filePath);

            const { error: updateError } = await supabase
              .from(media.source_table)
              .update({ url: publicUrl })
              .eq('id', media.id);

            if (updateError) throw updateError;

            toast({
              title: "Image mise à jour",
              description: "L'image a été mise à jour avec succès.",
            });

            onSave();
            setShowCropDialog(false);
          } catch (error) {
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Une erreur est survenue lors de la mise à jour de l'image.",
            });
          }
        }}
      />
    </>
  );
};