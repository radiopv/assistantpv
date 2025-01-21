import { Card } from "@/components/ui/card";

export const Impact = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Notre Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 text-center">
            <h3 className="text-2xl font-bold mb-2">100+</h3>
            <p>Enfants parrainés</p>
          </Card>
          <Card className="p-6 text-center">
            <h3 className="text-2xl font-bold mb-2">50+</h3>
            <p>Parrains actifs</p>
          </Card>
          <Card className="p-6 text-center">
            <h3 className="text-2xl font-bold mb-2">10+</h3>
            <p>Villes couvertes</p>
          </Card>
        </div>
      </div>
    </section>
  );
};