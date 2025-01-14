import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PersonalInfoFieldsProps {
  formData: {
    full_name: string;
    city: string;
    phone: string;
    email: string;
    motivation: string;
    facebook_url: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const PersonalInfoFields = ({ formData, handleChange }: PersonalInfoFieldsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="full_name">Nom complet *</Label>
        <Input
          id="full_name"
          name="full_name"
          required
          value={formData.full_name}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">Ville *</Label>
        <Input
          id="city"
          name="city"
          required
          value={formData.city}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="facebook_url">Profil Facebook</Label>
        <Input
          id="facebook_url"
          name="facebook_url"
          type="url"
          value={formData.facebook_url}
          onChange={handleChange}
          placeholder="Ex: https://www.facebook.com/votre.profil"
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="motivation">Motivation</Label>
        <Textarea
          id="motivation"
          name="motivation"
          value={formData.motivation}
          onChange={handleChange}
          rows={4}
          placeholder="Partagez votre motivation pour devenir parrain..."
        />
      </div>
    </div>
  );
};