import { useState } from "react";
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ImageCropDialogProps {
  open: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
  aspectRatio?: number;
}

export const ImageCropDialog = ({ open, onClose, imageSrc, onCropComplete, aspectRatio }: ImageCropDialogProps) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  const getCroppedImg = () => {
    if (!imageRef) return;

    const canvas = document.createElement('canvas');
    const scaleX = imageRef.naturalWidth / imageRef.width;
    const scaleY = imageRef.naturalHeight / imageRef.height;
    canvas.width = crop.width!;
    canvas.height = crop.height!;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set the canvas background to white
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      imageRef,
      crop.x! * scaleX,
      crop.y! * scaleY,
      crop.width! * scaleX,
      crop.height! * scaleY,
      0,
      0,
      crop.width!,
      crop.height!
    );

    canvas.toBlob((blob) => {
      if (blob) {
        onCropComplete(blob);
      }
    }, 'image/jpeg', 1);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageRef(e.currentTarget);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Recadrer la photo</DialogTitle>
        </DialogHeader>
        <div className="my-4">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            aspect={aspectRatio}
            className="max-h-[600px]"
          >
            <img
              src={imageSrc}
              onLoad={handleImageLoad}
              alt="À recadrer"
              crossOrigin="anonymous"
            />
          </ReactCrop>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={getCroppedImg}>
            Valider
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};