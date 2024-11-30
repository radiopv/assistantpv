const History = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900">Notre Histoire</h1>
      
      <div className="prose prose-lg mt-8 max-w-none">
        <p>
          Passion Varadero est née d'un désir profond d'aider les enfants cubains à avoir un meilleur avenir. Notre histoire commence en 2020, lorsqu'un groupe de personnes passionnées a décidé de faire une différence dans la vie de ces enfants.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Notre Mission</h2>
        <p>
          Notre mission est simple mais ambitieuse : permettre à chaque enfant cubain d'avoir accès à l'éducation, aux soins de santé et à un environnement favorable à son développement. Nous croyons fermement que chaque enfant mérite une chance de réaliser ses rêves.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Nos Valeurs</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Transparence dans toutes nos actions</li>
          <li>Engagement envers le bien-être des enfants</li>
          <li>Respect des cultures et des traditions locales</li>
          <li>Collaboration étroite avec les communautés locales</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Notre Impact</h2>
        <p>
          Depuis notre création, nous avons pu aider des centaines d'enfants grâce à notre programme de parrainage et nos actions sur le terrain. Chaque jour, nous travaillons pour étendre notre impact et toucher encore plus d'enfants dans le besoin.
        </p>
      </div>
    </div>
  );
};

export default History;