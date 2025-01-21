import { ProfilePhotoSection } from "../ProfilePhoto/ProfilePhotoSection";

interface PhotoSectionProps {
  child: any;
  editing: boolean;
  onPhotoUpdate: (url: string) => void;
}

export const PhotoSection = ({ child, editing, onPhotoUpdate }: PhotoSectionProps) => {
  return (
    <div className="relative">
      <ProfilePhotoSection
        child={child}
        editing={editing}
        onPhotoUpdate={onPhotoUpdate}
      />
      {!editing && (
        <img
          src={child.photo_url || "/placeholder.svg"}
          alt={child.name}
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )}
    </div>
  );
};