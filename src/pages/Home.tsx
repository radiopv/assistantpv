import { useLanguage } from "@/contexts/LanguageContext";

const Home = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-cover bg-center" style={{ backgroundImage: 'url(/lovable-uploads/c0c5a7da-df66-4f94-91c4-b5428f6fcc0d.png)' }}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t("changeLife")}</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            {t("giveHope")}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;