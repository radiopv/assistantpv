import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface FormData {
  full_name: string;
  city: string;
  phone: string;
  email: string;
  motivation: string;
  facebook_url: string;
  is_long_term: boolean;
  is_one_time: boolean;
  terms_accepted: boolean;
}

const BecomeSponsor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    city: "",
    phone: "",
    email: "",
    motivation: "",
    facebook_url: "",
    is_long_term: true,
    is_one_time: false,
    terms_accepted: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string) => {
    if (name === 'is_one_time') {
      setFormData(prev => ({ 
        ...prev, 
        is_one_time: !prev.is_one_time,
        is_long_term: prev.is_one_time // If one_time becomes true, long_term becomes false
      }));
    } else if (name === 'is_long_term') {
      setFormData(prev => ({ 
        ...prev, 
        is_long_term: !prev.is_long_term,
        is_one_time: prev.is_long_term // If long_term becomes true, one_time becomes false
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: !prev[name as keyof FormData] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.terms_accepted) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("pleaseAcceptTerms"),
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('sponsorship_requests')
        .insert({
          ...formData,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: t("success"),
        description: t("sponsorshipRequestSubmitted"),
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Error submitting request:', error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: error.message || t("errorSubmittingRequest"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">{t("becomeSponsor")}</h1>
          <p className="text-gray-600">{t("sponsorshipDescription")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">{t("fullName")} *</Label>
              <Input
                id="full_name"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">{t("city")} *</Label>
              <Input
                id="city"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("email")} *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t("phone")}</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="facebook_url">{t("facebookUrl")}</Label>
              <Input
                id="facebook_url"
                name="facebook_url"
                type="url"
                value={formData.facebook_url}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="motivation">{t("motivation")}</Label>
              <Textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_long_term"
                checked={formData.is_long_term}
                onCheckedChange={() => handleCheckboxChange('is_long_term')}
              />
              <Label htmlFor="is_long_term">{t("longTermSponsorship")}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_one_time"
                checked={formData.is_one_time}
                onCheckedChange={() => handleCheckboxChange('is_one_time')}
              />
              <Label htmlFor="is_one_time">Je souhaite un parrainage ponctuel (une seule fois)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms_accepted"
                required
                checked={formData.terms_accepted}
                onCheckedChange={() => handleCheckboxChange('terms_accepted')}
              />
              <Label htmlFor="terms_accepted">
                {t("acceptTerms")}
              </Label>
            </div>

            <p className="text-sm text-gray-500">
              {t("sponsorshipTerminationNote")}
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? t("submitting") : t("submitRequest")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BecomeSponsor;