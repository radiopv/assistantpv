import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

interface PasswordFieldsProps {
  password: string;
  confirmPassword: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PasswordFields = ({ password, confirmPassword, onChange }: PasswordFieldsProps) => {
  const { t } = useLanguage();

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="password">{t("password")} *</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={onChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t("confirmPassword")} *</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          onChange={onChange}
        />
      </div>
    </div>
  );
};