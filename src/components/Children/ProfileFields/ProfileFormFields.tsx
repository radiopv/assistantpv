import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { differenceInMonths, differenceInYears, parseISO } from "date-fns";

const STATUS_OPTIONS = [
  { value: "available", label: "Disponible" },
  { value: "sponsored", label: "Parrainé" },
  { value: "pending", label: "En attente" },
  { value: "urgent", label: "Besoins urgents" }
];

interface ProfileFormFieldsProps {
  child: any;
  editing: boolean;
  onChange: (field: string, value: string) => void;
}

const formatAge = (birthDate: string) => {
  const today = new Date();
  const birth = parseISO(birthDate);
  const years = differenceInYears(today, birth);
  
  if (years === 0) {
    const months = differenceInMonths(today, birth);
    return `${months} mois`;
  }
  
  return `${years} ans`;
};

export const ProfileFormFields = ({ child, editing, onChange }: ProfileFormFieldsProps) => {
  const { data: cities } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('city')
        .not('city', 'is', null)
        .order('city');
      
      if (error) throw error;
      
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
        <Label htmlFor="birth_date">Date de naissance</Label>
        <Input
          id="birth_date"
          type="date"
          value={child.birth_date}
          onChange={handleInputChange}
          disabled={!editing}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="age">Âge</Label>
        <Input
          id="age"
          value={formatAge(child.birth_date)}
          disabled
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
            defaultValue={child.status}
            value={child.status}
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut">
                {STATUS_OPTIONS.find(option => option.value === child.status)?.label || child.status}
              </SelectValue>
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
            value={STATUS_OPTIONS.find(option => option.value === child.status)?.label || child.status}
            disabled
          />
        )}
      </div>
    </div>
  );
};