import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#0088FE'];

// Temporary mock data until the Supabase function is ready
const MOCK_DATA = [
  { city: "Paris", urgent_needs_count: 5 },
  { city: "Lyon", urgent_needs_count: 3 },
  { city: "Marseille", urgent_needs_count: 4 }
];

export const UrgentNeedsStats = () => {
  const { t } = useLanguage();
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{t('urgentNeedsByCity')}</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={MOCK_DATA}
              dataKey="urgent_needs_count"
              nameKey="city"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {MOCK_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};