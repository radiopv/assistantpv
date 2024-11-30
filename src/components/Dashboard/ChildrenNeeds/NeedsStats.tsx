import { Card } from "@/components/ui/card";
import { Need } from "@/types/needs";

interface NeedsStatsProps {
  children: any[];
}

export const NeedsStats = ({ children }: NeedsStatsProps) => {
  const stats = children.reduce((acc, child) => {
    const needs = child.needs || [];
    const urgentNeeds = needs.filter((need: Need) => need.is_urgent);
    
    needs.forEach((need: Need) => {
      acc.categories[need.category] = (acc.categories[need.category] || 0) + 1;
    });
    
    acc.totalNeeds += needs.length;
    acc.urgentNeeds += urgentNeeds.length;
    if (needs.length > 0) acc.childrenWithNeeds++;
    
    return acc;
  }, { 
    categories: {} as Record<string, number>,
    totalNeeds: 0,
    urgentNeeds: 0,
    childrenWithNeeds: 0
  });

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Total des besoins</h3>
        <p className="text-2xl font-bold">{stats.totalNeeds}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Besoins urgents</h3>
        <p className="text-2xl font-bold text-red-600">{stats.urgentNeeds}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Enfants avec besoins</h3>
        <p className="text-2xl font-bold">{stats.childrenWithNeeds}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Catégories utilisées</h3>
        <p className="text-2xl font-bold">{Object.keys(stats.categories).length}</p>
      </Card>
    </div>
  );
};