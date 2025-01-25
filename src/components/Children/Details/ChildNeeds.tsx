import { Card } from "@/components/ui/card";
import { Need } from "@/types/needs";

interface ChildNeedsProps {
  needs: Need[];
}

export const ChildNeeds = ({ needs }: ChildNeedsProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Besoins</h2>
      <div className="space-y-4">
        {needs.map((need, index) => (
          <div key={index} className="space-y-2">
            <h3 className="font-medium">{need.category}</h3>
            <p className="text-gray-600">{need.description}</p>
            {need.is_urgent && (
              <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                Urgent
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};