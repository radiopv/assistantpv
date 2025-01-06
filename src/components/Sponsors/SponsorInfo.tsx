import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SponsorInfoProps {
  sponsor: any;
}

export const SponsorInfo = ({ sponsor }: SponsorInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={sponsor.photo_url} alt={sponsor.name} />
          <AvatarFallback>{sponsor.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{sponsor.name}</h3>
          <p className="text-sm text-gray-500">{sponsor.email}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-medium">Ville</p>
          <p className="text-gray-500">{sponsor.city || 'Non spécifié'}</p>
        </div>
        <div>
          <p className="font-medium">Téléphone</p>
          <p className="text-gray-500">{sponsor.phone || 'Non spécifié'}</p>
        </div>
        <div>
          <p className="font-medium">Facebook</p>
          <p className="text-gray-500">{sponsor.facebook_url || 'Non spécifié'}</p>
        </div>
        <div>
          <p className="font-medium">Rôle</p>
          <p className="text-gray-500">{sponsor.role || 'Non spécifié'}</p>
        </div>
      </div>
    </div>
  );
};