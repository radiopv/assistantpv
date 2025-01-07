import { useAuth } from "@/components/Auth/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const SponsorProfile = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">{t('myProfile')}</h1>
      
      <Card className="max-w-2xl mx-auto p-6">
        <div className="space-y-4">
          <div>
            <Label>{t('name')}</Label>
            <p className="text-gray-700">{user?.name}</p>
          </div>
          
          <div>
            <Label>{t('email')}</Label>
            <p className="text-gray-700">{user?.email}</p>
          </div>
          
          <div>
            <Label>{t('role')}</Label>
            <p className="text-gray-700">{t(user?.role || '')}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SponsorProfile;