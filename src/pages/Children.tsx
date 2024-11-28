import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "@/components/ErrorAlert";

interface Child {
  id: string;
  name: string;
  age: number;
  city: string;
  status: string;
  photo_url: string;
}

const Children = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: children, isLoading, error, refetch } = useQuery({
    queryKey: ['children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Child[];
    }
  });

  const filteredChildren = children?.filter(child => 
    child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="space-y-6">
        <ErrorAlert 
          message="Une erreur est survenue lors du chargement des enfants" 
          retry={() => refetch()}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enfants</h1>
          <p className="text-gray-600 mt-2">Gérez les enfants et leurs besoins</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un enfant
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Rechercher un enfant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredChildren?.map((child) => (
            <Card key={child.id} className="overflow-hidden">
              <img
                src={child.photo_url || "/placeholder.svg"}
                alt={child.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{child.name}</h3>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>{child.age} ans</p>
                  <p>{child.city}</p>
                  <span
                    className={cn(
                      "inline-block px-2 py-1 rounded-full text-xs",
                      child.status === "Disponible"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    )}
                  >
                    {child.status}
                  </span>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Voir le profil
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Children;
