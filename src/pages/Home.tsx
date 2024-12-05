import { useLanguage } from "@/contexts/LanguageContext";

const Home = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">
        Passion Varadero
      </h1>
      <p className="text-xl mb-4">
        {t('sponsorshipDescription')}
      </p>
    </div>
  );
};

export default Home;