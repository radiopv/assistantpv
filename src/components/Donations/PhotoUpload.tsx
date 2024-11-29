import { ChangeEvent } from "react";

export interface PhotoUploadProps {
  donationId?: string;
  onUploadComplete?: () => void;
  onPhotosChange?: (files: FileList) => void;
}

export const PhotoUpload = ({ donationId, onUploadComplete, onPhotosChange }: PhotoUploadProps) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onPhotosChange?.(files);
    }
  };

  return (
    <div className="mt-4">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-primary file:text-white
          hover:file:bg-primary/90"
      />
    </div>
  );
};