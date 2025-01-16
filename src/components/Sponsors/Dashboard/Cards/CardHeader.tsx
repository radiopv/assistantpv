import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CardHeaderProps {
  child: {
    name: string;
    photo_url?: string;
    birth_date?: string;
    age?: number;
  };
}

export const CardHeader = ({ child }: CardHeaderProps) => {
  const calculateDaysUntilBirthday = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    return Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const formattedBirthDate = child.birth_date 
    ? new Date(child.birth_date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : null;

  const daysUntilBirthday = child.birth_date 
    ? calculateDaysUntilBirthday(child.birth_date)
    : null;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <Avatar className="h-16 w-16">
        <AvatarImage src={child.photo_url} alt={child.name} />
        <AvatarFallback>{child.name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="text-lg font-semibold">{child.name}</h3>
        {formattedBirthDate && (
          <p className="text-sm text-gray-600">
            Né(e) le {formattedBirthDate}
          </p>
        )}
        {daysUntilBirthday !== null && (
          <p className="text-sm text-cuba-coral mt-1">
            {daysUntilBirthday === 0 
              ? "C'est son anniversaire aujourd'hui !" 
              : `Anniversaire dans ${daysUntilBirthday} jours`}
          </p>
        )}
      </div>
    </div>
  );
};