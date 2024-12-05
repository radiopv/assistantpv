import { useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: sponsor, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;

      if (!sponsor) {
        throw new Error(t("invalidCredentials"));
      }

      if (sponsor.password_hash !== password) {
        throw new Error(t("invalidCredentials"));
      }

      if (!['admin', 'assistant'].includes(sponsor.role)) {
        throw new Error(t("unauthorizedAccess"));
      }

      localStorage.setItem('user', JSON.stringify(sponsor));

      toast({
        title: t("loginSuccess"),
        description: t("welcomeAdmin"),
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: t("loginError"),
        description: error.message || t("genericError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6 bg-white">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">{t("administration")}</h1>
          <p className="text-gray-600">{t("loginDescription")}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t("emailPlaceholder")}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? t("loggingIn") : t("login")}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          {t("adminOnlySection")}
        </p>
      </Card>
    </div>
  );
};

export default Login;