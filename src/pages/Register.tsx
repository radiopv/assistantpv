import { useLanguage } from "@/contexts/LanguageContext";

const Register = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('register')}</h1>
      {/* Register form will be implemented later */}
    </div>
  );
};

export default Register;