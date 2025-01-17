import { Calendar, MapPin } from "lucide-react";

interface ChildBasicInfoProps {
  birthDate: string;
  city: string | null;
}

export const ChildBasicInfo = ({ birthDate, city }: ChildBasicInfoProps) => {
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="flex flex-wrap gap-4 text-gray-600">
      <div className="flex items-center gap-2 bg-white/50 px-3 py-2 rounded-lg">
        <Calendar className="w-5 h-5 text-cuba-coral" />
        <span>{birthDate ? `${calculateAge(birthDate)} ans` : "Non renseigné"}</span>
      </div>
      <div className="flex items-center gap-2 bg-white/50 px-3 py-2 rounded-lg">
        <MapPin className="w-5 h-5 text-cuba-coral" />
        <span>{city || "Non renseignée"}</span>
      </div>
    </div>
  );
};