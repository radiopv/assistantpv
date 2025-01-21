import { Card } from "@/components/ui/card";

export const Journey = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Votre Parcours</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6">
            <h3 className="font-bold mb-2">1. Choisissez</h3>
            <p>Parcourez les profils des enfants disponibles</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold mb-2">2. Connectez</h3>
            <p>Créez votre compte parrain</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold mb-2">3. Parrainez</h3>
            <p>Commencez votre aventure de parrainage</p>
          </Card>
        </div>
      </div>
    </section>
  );
};