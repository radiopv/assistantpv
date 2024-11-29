import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasicInfoFieldsProps {
  formData: {
    name: string;
    gender: string;
    birth_date: string;
    city: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: (data: any) => void;
}

export const BasicInfoFields = ({ formData, handleChange, setFormData }: BasicInfoFieldsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="name">Nom *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Nom de l'enfant"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Genre *</Label>
        <Select
          value={formData.gender}
          onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner le genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Masculin</SelectItem>
            <SelectItem value="female">Féminin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="birth_date">Date de naissance *</Label>
        <Input
          id="birth_date"
          name="birth_date"
          type="date"
          value={formData.birth_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">Ville</Label>
        <Input
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Ville de l'enfant"
        />
      </div>
    </div>
  );
};