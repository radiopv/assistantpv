import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus } from "lucide-react";

interface PhotoUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (data: {
    file: File;
    caption: string;
    description: string;
    category: string;
  }) => void;
}

const PHOTO_CATEGORIES = [
  { value: "general", label: "Général" },
  { value: "daily-life", label: "Vie quotidienne" },
  { value: "activities", label: "Activités" },
  { value: "special-events", label: "Événements spéciaux" },
  { value: "family", label: "Famille" },
];

export const PhotoUploadDialog = ({ open, onClose, onUpload }: PhotoUploadDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [preview, setPreview] = useState<string>("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = () => {
    if (file) {
      onUpload({
        file,
        caption,
        description,
        category,
      });
      resetForm();
    }
  };

  const resetForm = () => {
    setFile(null);
    setCaption("");
    setDescription("");
    setCategory("general");
    setPreview("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter une photo</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!file ? (
            <div className="flex items-center justify-center w-full">
              <label 
                htmlFor="photo-upload" 
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImagePlus className="w-12 h-12 mb-4 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    Cliquez pour sélectionner une photo
                  </p>
                </div>
                <input
                  id="photo-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
          ) : (
            <div className="relative aspect-square w-full">
              <img
                src={preview}
                alt="Aperçu"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {PHOTO_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Légende de la photo"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <Textarea
            placeholder="Description détaillée"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={!file}>
            Télécharger
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};