import { differenceInDays, format, isValid, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Gift } from "lucide-react";

interface BirthdayCountdownProps {
  children: Array<{
    name: string;
    birth_date: string;
    age: number;
  }>;
}

export const BirthdayCountdown = ({ children }: BirthdayCountdownProps) => {
  const getNextBirthday = (birthDate: string) => {
    const today = new Date();
    const birth = parseISO(birthDate);
    
    if (!isValid(birth)) {
      return null;
    }
    
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    return {
      date: nextBirthday,
      daysUntil: differenceInDays(nextBirthday, today)
    };
  };

  const sortedChildren = [...children]
    .filter(child => child.birth_date && isValid(parseISO(child.birth_date)))
    .sort((a, b) => {
      const aNext = getNextBirthday(a.birth_date);
      const bNext = getNextBirthday(b.birth_date);
      if (!aNext || !bNext) return 0;
      return aNext.daysUntil - bNext.daysUntil;
    });

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Gift className="w-5 h-5 text-cuba-coral" />
        Prochains anniversaires
      </h3>
      <div className="space-y-3">
        {sortedChildren.map((child) => {
          const nextBirthday = getNextBirthday(child.birth_date);
          if (!nextBirthday) return null;
          
          return (
            <div key={child.name} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{child.name}</p>
                <p className="text-sm text-gray-600">
                  {format(nextBirthday.date, "d MMMM", { locale: fr })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-cuba-coral font-bold">
                  {nextBirthday.daysUntil} jours
                </p>
                <p className="text-sm text-gray-600">
                  Fêtera ses {child.age + 1} ans
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};