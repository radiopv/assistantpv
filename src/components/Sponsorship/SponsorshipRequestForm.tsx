import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface SponsorshipRequestFormProps {
  onSubmit: (formData: any) => Promise<void>;
  loading: boolean;
  translations: any;
}

export const SponsorshipRequestForm = ({ 
  onSubmit, 
  loading,
  translations: t
}: SponsorshipRequestFormProps) => {
  const [formData, setFormData] = useState({
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

  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string) => {
    if (name === 'is_one_time') {
      setFormData(prev => ({ 
        ...prev, 
        is_one_time: !prev.is_one_time,
        is_long_term: prev.is_one_time
      }));
    } else if (name === 'is_long_term') {
      setFormData(prev => ({ 
        ...prev, 
        is_long_term: !prev.is_long_term,
        is_one_time: prev.is_long_term
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: !prev[name as keyof typeof formData] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.terms_accepted) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez accepter les conditions de parrainage",
      });
      return;
    }

    if (!formData.email || !formData.full_name) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
      });
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi du formulaire",
      });
    }
  };

  return (
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
          <Label htmlFor="is_one_time">{t("oneTimeSponsorship")}</Label>
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
  );
};