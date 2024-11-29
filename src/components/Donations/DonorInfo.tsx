import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface DonorInfoProps {
  donorName: string;
  onDonorNameChange: (value: string) => void;
  isAnonymous: boolean;
  onAnonymousChange: (value: boolean) => void;
}

export const DonorInfo = ({
  donorName,
  onDonorNameChange,
  isAnonymous,
  onAnonymousChange,
}: DonorInfoProps) => {
  return (
    <div className="space-y-4">
      <Label>Information du donateur</Label>
      <div className="flex items-center gap-4">
        <Input
          placeholder="Nom du donateur (optionnel)"
          value={donorName}
          onChange={(e) => onDonorNameChange(e.target.value)}
          disabled={isAnonymous}
        />
        <Button
          type="button"
          variant={isAnonymous ? "default" : "outline"}
          onClick={() => onAnonymousChange(!isAnonymous)}
        >
          Anonyme
        </Button>
      </div>
    </div>
  );
};