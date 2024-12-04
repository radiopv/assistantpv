import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SponsorshipType } from "@/types/supabase/sponsorships";

const SponsorshipRequestForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    city: "",
    phone: "",
    email: "",
    facebook_url: "",
    motivation: "",
    sponsorship_type: "long_term" as SponsorshipType,
    terms_accepted: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        title: "Demande envoyée",
        description: "Votre demande de parrainage a été envoyée avec succès. Nous vous contacterons bientôt.",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="space-y-2">
        <Label htmlFor="full_name">Nom complet *</Label>
        <Input
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          required
          placeholder="Votre nom complet"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">Ville *</Label>
        <Input
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          placeholder="Votre ville"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Votre numéro de téléphone"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="votre@email.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="facebook_url">Profil Facebook</Label>
        <Input
          id="facebook_url"
          name="facebook_url"
          type="url"
          value={formData.facebook_url}
          onChange={handleChange}
          placeholder="https://facebook.com/votre.profil"
        />
        <p className="text-sm text-gray-500">
          Exemple: https://facebook.com/john.doe
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="motivation">Vos motivations *</Label>
        <Textarea
          id="motivation"
          name="motivation"
          value={formData.motivation}
          onChange={handleChange}
          required
          placeholder="Expliquez-nous pourquoi vous souhaitez devenir parrain"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-3">
        <Label>Type de parrainage *</Label>
        <RadioGroup
          defaultValue="long_term"
          onValueChange={(value) => setFormData(prev => ({ ...prev, sponsorship_type: value }))}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="long_term" id="long_term" />
            <Label htmlFor="long_term">Parrainage à long terme</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="one_time" id="one_time" />
            <Label htmlFor="one_time">Don unique (cadeau ponctuel)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="terms"
          required
          className="rounded border-gray-300"
          onChange={(e) => setFormData(prev => ({ ...prev, terms_accepted: e.target.checked }))}
        />
        <Label htmlFor="terms" className="text-sm">
          J'accepte les conditions d'utilisation et la politique de confidentialité *
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Envoi en cours..." : "Envoyer ma demande"}
      </Button>
    </form>
  );
};

export default SponsorshipRequestForm;