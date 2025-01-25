import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PersonalInfoFields } from "@/components/Sponsor/SponsorshipForm/PersonalInfoFields";
import { SponsorshipTypeSelection } from "@/components/Sponsor/SponsorshipForm/SponsorshipTypeSelection";
import { PasswordFields } from "@/components/Sponsor/SponsorshipForm/PasswordFields";
import bcrypt from 'bcryptjs';

interface FormData {
  full_name: string;
  city: string;
  phone: string;
  email: string;
  motivation: string;
  facebook_url: string;
  is_long_term: boolean;
  is_one_time: boolean;
  password: string;
  confirmPassword: string;
}

const BecomeSponsor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
    password: "",
    confirmPassword: ""
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
        is_long_term: prev.is_one_time
      }));
    } else if (name === 'is_long_term') {
      setFormData(prev => ({ 
        ...prev, 
        is_long_term: !prev.is_long_term,
        is_one_time: prev.is_long_term
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(formData.password, salt);

      const { error } = await supabase
        .from('sponsorship_requests')
        .insert({
          ...formData,
          password_hash: hashedPassword,
          status: 'pending',
          is_account_created: false,
          is_account_approved: false
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre demande de parrainage a été envoyée avec succès",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Error submitting request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi de votre demande",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Devenir Parrain</h1>
          <p className="text-gray-600">Remplissez le formulaire ci-dessous pour commencer votre parcours de parrainage</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <PersonalInfoFields 
            formData={formData}
            handleChange={handleChange}
          />

          <PasswordFields
            password={formData.password}
            confirmPassword={formData.confirmPassword}
            onChange={handleChange}
          />

          <SponsorshipTypeSelection
            isLongTerm={formData.is_long_term}
            isOneTime={formData.is_one_time}
            onCheckboxChange={handleCheckboxChange}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Envoi en cours..." : "Envoyer la demande"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BecomeSponsor;