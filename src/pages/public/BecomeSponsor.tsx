import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

const BecomeSponsor = () => {
  const [searchParams] = useSearchParams();
  const childId = searchParams.get('child');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    facebook_url: '',
    motivation: '',
    terms_accepted: false
  });

  const { data: child } = useQuery({
    queryKey: ['public-child', childId],
    enabled: !!childId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('name, photo_url')
        .eq('id', childId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.terms_accepted) {
      toast.error("Veuillez accepter les conditions");
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('sponsorship_requests')
        .insert({
          ...formData,
          child_id: childId
        });

      if (error) throw error;

      toast.success("Votre demande a été envoyée avec succès");
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        facebook_url: '',
        motivation: '',
        terms_accepted: false
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error("Une erreur est survenue lors de l'envoi de votre demande");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Devenir parrain</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Pourquoi devenir parrain ?
            </h2>
            <div className="prose">
              <p>
                En devenant parrain, vous aidez directement un enfant dans le besoin.
                Votre soutien permet de :
              </p>
              <ul>
                <li>Fournir une éducation de qualité</li>
                <li>Assurer des soins médicaux</li>
                <li>Offrir des vêtements et de la nourriture</li>
                <li>Créer un lien spécial avec un enfant</li>
              </ul>
            </div>
          </Card>

          {child && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Enfant sélectionné
              </h2>
              <div className="flex items-center gap-4">
                <img
                  src={child.photo_url || "/placeholder.svg"}
                  alt={child.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <p className="font-medium">{child.name}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nom complet *</Label>
              <Input
                id="full_name"
                required
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  full_name: e.target.value
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  phone: e.target.value
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook_url">Profil Facebook</Label>
              <Input
                id="facebook_url"
                value={formData.facebook_url}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  facebook_url: e.target.value
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivation">Motivation *</Label>
              <Textarea
                id="motivation"
                required
                value={formData.motivation}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  motivation: e.target.value
                }))}
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="terms"
                checked={formData.terms_accepted}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  terms_accepted: checked as boolean
                }))}
              />
              <Label htmlFor="terms" className="text-sm">
                J'accepte les conditions de parrainage
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Envoi en cours..." : "Envoyer ma demande"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default BecomeSponsor;