import { useQuery } from "@tanstack/react-query";
import { NotificationBar } from "@/components/Dashboard/NotificationBar";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format, addYears, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";

const Dashboard = () => {
  const { data: upcomingBirthdays } = useQuery({
    queryKey: ['upcoming-birthdays'],
    queryFn: async () => {
      const { data: children } = await supabase
        .from('children')
        .select('id, name, birth_date, age')
        .not('birth_date', 'is', null)
        .order('birth_date');

      if (!children) return [];

      const today = new Date();
      const nextBirthdays = children
        .map(child => {
          const birthDate = new Date(child.birth_date);
          const nextBirthday = addYears(birthDate, child.age + 1);
          const daysUntil = differenceInDays(nextBirthday, today);
          return {
            ...child,
            nextBirthday,
            daysUntil,
          };
        })
        .filter(child => child.daysUntil >= 0 && child.daysUntil <= 30)
        .sort((a, b) => a.daysUntil - b.daysUntil);

      return nextBirthdays;
    }
  });

  return (
    <div className="container mx-auto p-6 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <NotificationBar />
      </div>
      
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Messages récents</h2>
          <p className="text-gray-600">
            Consultez vos messages et notifications dans l'onglet Messages.
          </p>
        </div>
      </Card>

      {upcomingBirthdays && upcomingBirthdays.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Anniversaires à venir</h2>
            <div className="divide-y">
              {upcomingBirthdays.map((child) => (
                <div key={child.id} className="py-3">
                  <p className="text-gray-800">
                    <span className="font-medium">{child.name}</span> - {child.daysUntil === 0 ? (
                      <span className="text-green-600 font-semibold">Aujourd'hui !</span>
                    ) : (
                      <span>
                        {format(child.nextBirthday, "d MMMM", { locale: fr })} ({child.daysUntil} jours)
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    Fêtera ses {child.age + 1} ans
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;