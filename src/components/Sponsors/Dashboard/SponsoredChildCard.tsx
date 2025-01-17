import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";

interface SponsoredChildCardProps {
  child: {
    name: string;
    photo_url: string | null;
    city: string | null;
  };
}

export const SponsoredChildCard = ({ child }: SponsoredChildCardProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="aspect-video relative rounded-lg overflow-hidden">
          <img
            src={child.photo_url || "/placeholder.svg"}
            alt={child.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex items-center gap-2">
          <User className="w-5 h-5" />
          <h2 className="text-xl font-semibold">{child.name}</h2>
        </div>
        {child.city && <p className="text-gray-600">{child.city}</p>}
      </div>
    </Card>
  );
};