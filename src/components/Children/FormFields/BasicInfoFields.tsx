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
  translations: any;
}

export const BasicInfoFields = ({ formData, handleChange, setFormData, translations }: BasicInfoFieldsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="name">{translations.name} *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder={translations.name}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">{translations.gender} *</Label>
        <Select
          value={formData.gender}
          onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder={translations.selectGender} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">{translations.male}</SelectItem>
            <SelectItem value="female">{translations.female}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="birth_date">{translations.birthDate} *</Label>
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
        <Label htmlFor="city">{translations.city}</Label>
        <Input
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder={translations.city}
        />
      </div>
    </div>
  );
};