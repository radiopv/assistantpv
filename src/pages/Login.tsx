import { useLanguage } from "@/contexts/LanguageContext";

const Login = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('login')}</h1>
      {/* Login form will be implemented later */}
    </div>
  );
};

export default Login;