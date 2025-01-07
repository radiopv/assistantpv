import { ArrowRight } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      title: "Choisir un enfant",
      description: "Parcourez les profils des enfants en attente de parrainage",
    },
    {
      title: "Compléter votre profil",
      description: "Remplissez les informations nécessaires pour devenir parrain",
    },
    {
      title: "Commencer le parrainage",
      description: "Démarrez votre aventure de parrainage avec votre filleul(e)",
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex-1 text-center">
                <div className="mb-4">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white text-xl font-bold">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block text-gray-400 mx-4" size={24} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};