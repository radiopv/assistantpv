import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface Sponsorship {
  id: string;
  child: {
    id: string;
    name: string;
    photo_url: string;
  };
  sponsor: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  start_date: string;
  status: string;
}

export const SponsorshipList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: sponsorships, isLoading } = useQuery({
    queryKey: ["sponsorships"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsorships")
        .select(`
          id,
          start_date,
          status,
          child:children(id, name, photo_url),
          sponsor:sponsors(id, name, email, phone, address)
        `)
        .order("start_date", { ascending: false });

      if (error) throw error;
      return data as Sponsorship[];
    },
  });

  const filteredSponsorships = sponsorships?.filter((sponsorship) => {
    const matchesSearch =
      sponsorship.child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sponsorship.sponsor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || sponsorship.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Rechercher par nom d'enfant ou de parrain..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="ended">Terminé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredSponsorships?.map((sponsorship) => (
          <Card key={sponsorship.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                {sponsorship.child.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={sponsorship.child.photo_url || "/placeholder.svg"}
                    alt={sponsorship.child.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm text-gray-500">Début du parrainage</p>
                    <p className="font-medium">
                      {new Date(sponsorship.start_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">{sponsorship.sponsor.name}</h4>
                  <p className="text-sm text-gray-500">{sponsorship.sponsor.email}</p>
                  <p className="text-sm text-gray-500">{sponsorship.sponsor.phone}</p>
                  <p className="text-sm text-gray-500">{sponsorship.sponsor.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};