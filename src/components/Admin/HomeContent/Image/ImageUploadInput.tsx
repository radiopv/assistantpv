import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface ImageUploadInputProps {
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

export const ImageUploadInput = ({ onImageSelect, isUploading }: ImageUploadInputProps) => {
  return (
    <div className="space-y-4">
      <Input
        type="file"
        accept="image/*"
        onChange={onImageSelect}
        disabled={isUploading}
        className="mb-4"
      />
      <p className="text-sm text-gray-500">
        Format recommandé : 1920x1080px, JPG ou PNG, max 5MB
      </p>
      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Upload en cours...
        </div>
      )}
    </div>
  );
};