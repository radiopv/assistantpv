import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Child = Database["public"]["Tables"]["children"]["Row"];

export const FeaturedChildren = () => {
  const [children, setChildren] = useState<Child[]>([]);

  useEffect(() => {
    const fetchFeaturedChildren = async () => {
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("is_sponsored", false)
        .limit(3);

      if (error) {
        console.error("Error fetching children:", error);
        return;
      }

      setChildren(data || []);
    };

    fetchFeaturedChildren();
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Enfants en attente de parrainage</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {children.map((child) => (
            <Card key={child.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={child.photo_url || "/placeholder.svg"}
                  alt={child.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{child.name}</h3>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>{child.age} ans</p>
                  <p>{child.city}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {child.needs && child.needs.slice(0, 2).map((need: any, index: number) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
                    >
                      {need.category}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};