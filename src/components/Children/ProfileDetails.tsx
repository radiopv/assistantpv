import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ProfilePhotoUpload } from "./ProfilePhoto/ProfilePhotoUpload";

interface ProfileDetailsProps {
  child: any;
  editing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoUpdate: (url: string) => void;
}

export const ProfileDetails = ({ 
  child, 
  editing, 
  onChange,
  onPhotoUpdate 
}: ProfileDetailsProps) => {
  return (
    <Card className="p-6">
      <div className="grid gap-6">
        <div className="aspect-video relative rounded-lg overflow-hidden">
          <img
            src={child.photo_url || "/placeholder.svg"}
            alt={child.name}
            className="w-full h-full object-cover"
          />
        </div>

        {editing && (
          <ProfilePhotoUpload
            childId={child.id}
            currentPhotoUrl={child.photo_url}
            onUploadComplete={onPhotoUpdate}
          />
        )}

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              value={child.name}
              onChange={onChange}
              disabled={!editing}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="age">Âge</Label>
            <Input
              id="age"
              type="number"
              value={child.age}
              onChange={onChange}
              disabled={!editing}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              value={child.city}
              onChange={onChange}
              disabled={!editing}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Statut</Label>
            <Input
              id="status"
              value={child.status}
              onChange={onChange}
              disabled={!editing}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};