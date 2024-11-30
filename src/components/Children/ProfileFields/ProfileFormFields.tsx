import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { differenceInMonths, differenceInYears, parseISO } from "date-fns";
import { useTranslations } from "@/hooks/useTranslations";

const STATUS_OPTIONS = [
  { value: "available", label_key: "status_available" },
  { value: "sponsored", label_key: "status_sponsored" },
  { value: "pending", label_key: "status_pending" },
  { value: "urgent", label_key: "status_urgent" }
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
  const { t } = useTranslations();

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
        <Label htmlFor="name">{t('name')}</Label>
        <Input
          id="name"
          value={child.name}
          onChange={handleInputChange}
          disabled={!editing}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="birth_date">{t('birth_date')}</Label>
        <Input
          id="birth_date"
          type="date"
          value={child.birth_date}
          onChange={handleInputChange}
          disabled={!editing}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="age">{t('age')}</Label>
        <Input
          id="age"
          value={formatAge(child.birth_date)}
          disabled
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="city">{t('city')}</Label>
        {editing ? (
          <Select
            value={child.city || ""}
            onValueChange={(value) => handleSelectChange("city", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('select_city')} />
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
        <Label htmlFor="status">{t('status')}</Label>
        {editing ? (
          <Select
            defaultValue={child.status}
            value={child.status}
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('select_status')}>
                {t(STATUS_OPTIONS.find(option => option.value === child.status)?.label_key || '')}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {t(status.label_key)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            id="status"
            value={t(STATUS_OPTIONS.find(option => option.value === child.status)?.label_key || '')}
            disabled
          />
        )}
      </div>
    </div>
  );
};