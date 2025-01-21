import { Card } from "@/components/ui/card";
import { format } from "date-fns";

interface ChildHeaderProps {
  name: string;
  photoUrl: string | null;
  birthDate: string;
  formatAge: (birthDate: string) => string;
}

export const ChildHeader = ({ name, photoUrl, birthDate, formatAge }: ChildHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <Card className="overflow-hidden w-full md:w-1/3">
        <img
          src={photoUrl || "/placeholder.svg"}
          alt={name}
          className="w-full aspect-square object-cover"
        />
      </Card>
      <div className="flex-1 space-y-4">
        <h1 className="text-3xl font-bold">{name}</h1>
        <div className="space-y-2">
          <p className="text-lg">
            {formatAge(birthDate)}
          </p>
          <p className="text-sm text-gray-500">
            Né(e) le {format(new Date(birthDate), 'dd/MM/yyyy')}
          </p>
        </div>
      </div>
    </div>
  );
};