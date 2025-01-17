import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PhotoUploadPreviewProps {
  selectedFile: File | null;
  handleUpload: () => void;
}

export const PhotoUploadPreview = ({ selectedFile, handleUpload }: PhotoUploadPreviewProps) => {
  if (!selectedFile) return null;

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <img
        src={URL.createObjectURL(selectedFile)}
        alt="Preview"
        className="w-20 h-20 object-cover rounded"
      />
      <div className="flex-1">
        <p className="text-sm font-medium">{selectedFile.name}</p>
        <Button onClick={handleUpload} className="mt-2">
          Uploader
        </Button>
      </div>
    </div>
  );
};