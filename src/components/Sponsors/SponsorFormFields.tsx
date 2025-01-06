import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SponsorFormFieldsProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSwitchChange: (field: string, value: boolean) => void;
  handleSelectChange: (field: string, value: string) => void;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SponsorFormFields = ({
  formData,
  handleInputChange,
  handleSwitchChange,
  handleSelectChange,
  handlePhotoChange,
}: SponsorFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nom du parrain"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email du parrain"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Numéro de téléphone"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Ville"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Adresse"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="facebook_url">Facebook</Label>
          <Input
            id="facebook_url"
            value={formData.facebook_url}
            onChange={handleInputChange}
            placeholder="URL Facebook"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Rôle</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => handleSelectChange('role', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sponsor">Parrain</SelectItem>
              <SelectItem value="admin">Administrateur</SelectItem>
              <SelectItem value="assistant">Assistant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="photo">Photo</Label>
          <Input
            id="photo"
            type="file"
            onChange={handlePhotoChange}
            accept="image/*"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="is_active">Actif</Label>
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => handleSwitchChange('is_active', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="is_anonymous">Anonyme</Label>
          <Switch
            id="is_anonymous"
            checked={formData.is_anonymous}
            onCheckedChange={(checked) => handleSwitchChange('is_anonymous', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="show_name_publicly">Afficher le nom publiquement</Label>
          <Switch
            id="show_name_publicly"
            checked={formData.show_name_publicly}
            onCheckedChange={(checked) => handleSwitchChange('show_name_publicly', checked)}
          />
        </div>
      </div>
    </div>
  );
};