import { Card } from "@/components/ui/card";

export const Featured = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Enfants à Parrainer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Featured children will be dynamically loaded */}
          <Card className="p-4">
            <p className="text-center text-gray-500">Chargement des enfants...</p>
          </Card>
        </div>
      </div>
    </section>
  );
};