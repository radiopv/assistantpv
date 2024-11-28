import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const Children = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const children = [
    {
      id: 1,
      name: "Maria Rodriguez",
      age: 8,
      city: "La Havane",
      status: "Disponible",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    },
    {
      id: 2,
      name: "Carlos Hernandez",
      age: 10,
      city: "Santiago de Cuba",
      status: "Parrainé",
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    },
  ];

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
          {children.map((child) => (
            <Card key={child.id} className="overflow-hidden">
              <img
                src={child.imageUrl}
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