import { Card } from "@/components/ui/card";

interface ChildPhotoProps {
  photoUrl: string | null;
  name: string;
}

export const ChildPhoto = ({ photoUrl, name }: ChildPhotoProps) => {
  return (
    <Card className="overflow-hidden border-cuba-coral/20 shadow-lg transition-transform hover:scale-[1.01] duration-300">
      <div className="aspect-square relative">
        <img
          src={photoUrl || "/placeholder.svg"}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </Card>
  );
};