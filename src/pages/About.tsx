import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">À propos de nous</h1>
      <div className="prose max-w-none">
        <p className="mb-4">
          Passion Varadero est une initiative dédiée à aider les enfants cubains à travers un système de parrainage transparent et efficace.
        </p>
        <p className="mb-4">
          Notre mission est de créer des liens durables entre les parrains et les enfants, tout en assurant que chaque don et chaque effort contribue directement au bien-être des enfants.
        </p>
        <p>
          Nous travaillons en étroite collaboration avec des assistants locaux pour identifier les besoins et assurer que l'aide parvient efficacement aux enfants qui en ont le plus besoin.
        </p>
      </div>
    </div>
  );
};

export default About;