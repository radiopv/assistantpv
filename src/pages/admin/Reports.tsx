import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Reports = () => {
  // Rapport sur les dons par catégorie
  const { data: categoryStats } = useQuery({
    queryKey: ["donation-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_category_donation_stats');
      if (error) throw error;
      return data;
    }
  });

  // Rapport sur les performances des assistants
  const { data: assistantStats } = useQuery({
    queryKey: ["assistant-performance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_assistant_performance_stats');
      if (error) throw error;
      return data;
    }
  });

  // Rapport sur les besoins urgents par ville
  const { data: urgentNeedsStats } = useQuery({
    queryKey: ["urgent-needs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_urgent_needs_by_city');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Rapports</h1>
        <p className="text-gray-600 mt-2">
          Analyse détaillée des données de la plateforme
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Rapport des dons par catégorie */}
        <Card>
          <CardHeader>
            <CardTitle>Dons par catégorie</CardTitle>
            <CardDescription>
              Distribution des dons selon les catégories d'aide
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryStats}
                    dataKey="quantity"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {categoryStats?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Rapport des performances des assistants */}
        <Card>
          <CardHeader>
            <CardTitle>Performance des assistants</CardTitle>
            <CardDescription>
              Nombre de dons et personnes aidées par assistant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assistantStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="assistant_name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="donations_count" fill="#8884d8" name="Dons" />
                  <Bar dataKey="people_helped" fill="#82ca9d" name="Personnes aidées" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Rapport des besoins urgents par ville */}
        <Card>
          <CardHeader>
            <CardTitle>Besoins urgents par ville</CardTitle>
            <CardDescription>
              Distribution des besoins urgents selon les villes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={urgentNeedsStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="city" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="urgent_needs_count" fill="#ff7c43" name="Besoins urgents" />
                  <Bar dataKey="total_needs" fill="#82ca9d" name="Total des besoins" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;