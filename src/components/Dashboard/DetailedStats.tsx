import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
  Cell
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Need } from "@/types/needs";
import { useLanguage } from "@/contexts/LanguageContext";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const DetailedStats = () => {
  const { t } = useLanguage();

  const { data: urgentNeeds, isLoading: urgentLoading, error: urgentError } = useQuery({
    queryKey: ['urgent-needs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('id, name, needs')
        .not('needs', 'is', null);
      
      if (error) throw error;

      return data.filter(child => {
        if (!child.needs) return false;
        const needs = typeof child.needs === 'string' ? JSON.parse(child.needs) : child.needs;
        return Array.isArray(needs) && needs.some((need: Need) => need.is_urgent);
      });
    }
  });

  const { data: cityStats, isLoading: cityLoading, error: cityError } = useQuery({
    queryKey: ['city-donations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('city')
        .not('city', 'is', null);
      
      if (error) throw error;

      const cityCounts = data.reduce((acc: any, child) => {
        acc[child.city] = (acc[child.city] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(cityCounts)
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => (b.count as number) - (a.count as number))
        .slice(0, 5);
    }
  });

  const { data: sponsorshipStats, isLoading: sponsorshipLoading, error: sponsorshipError } = useQuery({
    queryKey: ['sponsorship-stats'],
    queryFn: async () => {
      const { data: sponsorships, error } = await supabase
        .from('sponsorships')
        .select('status, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const stats = {
        active: sponsorships?.filter(s => s.status === 'active').length || 0,
        pending: sponsorships?.filter(s => s.status === 'pending').length || 0,
        ended: sponsorships?.filter(s => s.status === 'ended').length || 0
      };

      return stats;
    }
  });

  const renderError = (message: string) => (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <div className="ml-2">{message}</div>
    </Alert>
  );

  const renderSkeleton = () => (
    <div className="h-[300px] w-full">
      <Skeleton className="h-full w-full" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">{t('urgentNeeds')}</h3>
          <div className="h-[300px]">
            {urgentError ? renderError(t('error')) : 
             urgentLoading ? renderSkeleton() : (
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  {urgentNeeds?.map((child) => {
                    const needs = typeof child.needs === 'string' 
                      ? JSON.parse(child.needs) 
                      : child.needs;
                    
                    const urgentNeeds = needs.filter((need: Need) => need.is_urgent);

                    return (
                      <div key={child.id} className="p-3 bg-red-50 rounded-lg">
                        <p className="font-medium text-gray-900">{child.name}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {urgentNeeds.map((need: Need, index: number) => (
                            <Badge 
                              key={`${need.category}-${index}`}
                              variant="destructive"
                            >
                              {need.category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">{t('topCities')}</h3>
          <div className="h-[300px]">
            {cityError ? renderError(t('error')) :
             cityLoading ? renderSkeleton() : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cityStats}
                    dataKey="count"
                    nameKey="city"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {cityStats?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">{t('sponsorshipStats')}</h3>
          <div className="space-y-4">
            {sponsorshipError ? renderError(t('error')) :
             sponsorshipLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center p-3 bg-green-100 rounded">
                  <span>{t('activeSponsorships')}</span>
                  <span className="font-bold">{sponsorshipStats?.active}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-100 rounded">
                  <span>{t('pendingSponsorships')}</span>
                  <span className="font-bold">{sponsorshipStats?.pending}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-100 rounded">
                  <span>{t('completedSponsorships')}</span>
                  <span className="font-bold">{sponsorshipStats?.ended}</span>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
