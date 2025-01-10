import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, Loader2 } from "lucide-react";

interface UploadSectionProps {
  children: Array<{
    id: string;
    child_id: string;
    children: {
      id: string;
      name: string;
    };
  }>;
  selectedChildId: string;
  onChildSelect: (childId: string) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  translations: {
    selectChild: string;
    addPhoto: string;
    uploading: string;
  };
}

export const UploadSection = ({
  children,
  selectedChildId,
  onChildSelect,
  onFileSelect,
  uploading,
  translations
}: UploadSectionProps) => {
  return (
    <div className="flex gap-4 items-center">
      <Select value={selectedChildId} onValueChange={onChildSelect}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={translations.selectChild} />
        </SelectTrigger>
        <SelectContent>
          {children?.map((sponsorship) => (
            <SelectItem key={sponsorship.children.id} value={sponsorship.children.id}>
              {sponsorship.children.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div>
        <input
          type="file"
          id="photo-upload"
          className="hidden"
          accept="image/*"
          onChange={onFileSelect}
          disabled={uploading}
        />
        <Button
          onClick={() => document.getElementById('photo-upload')?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <ImagePlus className="w-4 h-4 mr-2" />
          )}
          {uploading ? translations.uploading : translations.addPhoto}
        </Button>
      </div>
    </div>
  );
};