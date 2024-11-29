import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ProfilePhotoUpload } from "./ProfilePhoto/ProfilePhotoUpload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProfileDetailsProps {
  child: any;
  editing: boolean;
  onChange: (field: string, value: string) => void;
  onPhotoUpdate: (url: string) => void;
}

const STATUS_OPTIONS = [
  { value: "Disponible", label: "Disponible" },
  { value: "Parrainé", label: "Parrainé" },
  { value: "En attente", label: "En attente" },
  { value: "Besoins urgents", label: "Besoins urgents" }
];

export const ProfileDetails = ({ 
  child, 
  editing, 
  onChange,
  onPhotoUpdate 
}: ProfileDetailsProps) => {
  // Fetch cities from Supabase
  const { data: cities } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('city')
        .not('city', 'is', null)
        .order('city');
      
      if (error) throw error;
      
      // Get unique cities
      const uniqueCities = [...new Set(data.map(item => item.city))];
      return uniqueCities;
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.id, e.target.value);
  };

  const handleSelectChange = (field: string, value: string) => {
    onChange(field, value);
  };

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
              onChange={handleInputChange}
              disabled={!editing}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="age">Âge</Label>
            <Input
              id="age"
              type="number"
              value={child.age}
              onChange={handleInputChange}
              disabled={!editing}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="city">Ville</Label>
            {editing ? (
              <Select
                value={child.city || ""}
                onValueChange={(value) => handleSelectChange("city", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une ville" />
                </SelectTrigger>
                <SelectContent>
                  {cities?.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="city"
                value={child.city}
                disabled
              />
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Statut</Label>
            {editing ? (
              <Select
                value={child.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="status"
                value={child.status}
                disabled
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};